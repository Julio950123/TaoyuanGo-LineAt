import { Router } from 'express';
import { validateSignature } from '@line/bot-sdk';
import { lineClient } from '../line';
import { supabase } from '../supabase';
import { storeFlexMessage, writerFlexMessage, newsFlexMessage } from '../templates/flex';

export const webhookRouter = Router();

const BASE_URL = () => process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

webhookRouter.post('/', async (req, res) => {
  const signature = req.headers['x-line-signature'] as string;
  const body = req.body as Buffer;

  if (!validateSignature(body, process.env.LINE_CHANNEL_SECRET!, signature)) {
    return res.status(403).json({ error: 'invalid signature' });
  }

  const events = JSON.parse(body.toString()).events;

  for (const event of events) {
    try {
      // Track follow/unfollow
      if (event.type === 'follow') {
        const userId = event.source?.userId;
        if (userId) {
          const profile = await lineClient.getProfile(userId);
          await supabase.from('line_friends').upsert({
            line_user_id: userId,
            display_name: profile.displayName,
            picture_url: profile.pictureUrl || null,
            follow_status: 'followed',
            followed_at: new Date().toISOString(),
          }, { onConflict: 'line_user_id' });
        }
        continue;
      }
      if (event.type === 'unfollow') {
        const userId = event.source?.userId;
        if (userId) {
          await supabase.from('line_friends').update({ follow_status: 'blocked' }).eq('line_user_id', userId);
        }
        continue;
      }

      if (event.type !== 'message' || event.message.type !== 'text') continue;

      const text = event.message.text.trim();
      const replyToken = event.replyToken;

      if (text === '最新消息') {
        const today = new Date().toISOString().slice(0, 10);
        // Get activity news (up to 8)
        const { data: activities } = await supabase.from('news').select('*')
          .eq('published', true).eq('type', 'activity')
          .or(`end_date.is.null,end_date.gte.${today}`)
          .or(`start_date.is.null,start_date.lte.${today}`)
          .order('created_at', { ascending: false })
          .limit(8);
        // Get latest 1 winner news
        const { data: winners } = await supabase.from('news').select('*')
          .eq('published', true).eq('type', 'winner')
          .order('created_at', { ascending: false })
          .limit(1);
        const combined = [...(winners || []), ...(activities || [])].slice(0, 9);
        if (combined.length) {
          const moreUrl = `${BASE_URL()}/pages/news`;
          await lineClient.replyMessage({ replyToken, messages: [newsFlexMessage(combined, moreUrl)] as any });
        } else {
          await lineClient.replyMessage({ replyToken, messages: [{ type: 'text', text: '目前沒有最新消息！' }] });
        }
      } else if (text === '店家優惠') {
        // 回傳網頁連結
        await lineClient.replyMessage({ replyToken, messages: [{
          type: 'text',
          text: `🎁 店家優惠\n\n點擊查看所有優惠資訊：\n${BASE_URL()}/pages/offers`
        }] });
      } else if (text === '合作店家') {
        const { data } = await supabase.from('stores').select('*').eq('active', true);
        if (data?.length) {
          // Randomly pick 9 stores
          const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 9);
          const moreUrl = `${BASE_URL()}/pages/stores`;
          await lineClient.replyMessage({ replyToken, messages: [storeFlexMessage(shuffled, moreUrl)] as any });
        } else {
          await lineClient.replyMessage({ replyToken, messages: [{ type: 'text', text: '目前沒有合作店家資訊！' }] });
        }
      } else if (text === '好文推薦') {
        const { data } = await supabase.from('writers').select('*').eq('active', true).order('sort_order').limit(10);
        if (data?.length) {
          await lineClient.replyMessage({ replyToken, messages: [writerFlexMessage(data)] as any });
        } else {
          await lineClient.replyMessage({ replyToken, messages: [{ type: 'text', text: '目前沒有好文推薦！' }] });
        }
      }
    } catch (err) {
      console.error('Webhook error:', err);
    }
  }

  res.json({ ok: true });
});
