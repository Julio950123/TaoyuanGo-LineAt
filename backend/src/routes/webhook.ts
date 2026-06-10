import { Router } from 'express';
import { validateSignature } from '@line/bot-sdk';
import { lineClient } from '../line';
import { supabase } from '../supabase';
import { newsFlexMessage, storeFlexMessage, offersFlexMessage, writerFlexMessage } from '../templates/flex';

export const webhookRouter = Router();

webhookRouter.post('/', async (req, res) => {
  const signature = req.headers['x-line-signature'] as string;
  const body = req.body as Buffer;

  if (!validateSignature(body, process.env.LINE_CHANNEL_SECRET!, signature)) {
    return res.status(403).json({ error: 'invalid signature' });
  }

  const events = JSON.parse(body.toString()).events;

  for (const event of events) {
    if (event.type !== 'message' || event.message.type !== 'text') continue;

    const text = event.message.text.trim();
    const replyToken = event.replyToken;

    try {
      if (text === '最新消息') {
        const { data } = await supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false }).limit(10);
        if (data?.length) {
          await lineClient.replyMessage({ replyToken, messages: [newsFlexMessage(data)] as any });
        } else {
          await lineClient.replyMessage({ replyToken, messages: [{ type: 'text', text: '目前沒有最新消息喔！' }] });
        }
      } else if (text === '店家優惠') {
        const { data } = await supabase.from('store_offers').select('*, stores(name)').eq('active', true).order('created_at', { ascending: false }).limit(10);
        if (data?.length) {
          await lineClient.replyMessage({ replyToken, messages: [offersFlexMessage(data)] as any });
        } else {
          await lineClient.replyMessage({ replyToken, messages: [{ type: 'text', text: '目前沒有優惠資訊喔！' }] });
        }
      } else if (text === '合作店家') {
        const { data: settings } = await supabase.from('settings').select('value').eq('key', 'stores_page_url').single();
        const { data } = await supabase.from('stores').select('*').eq('active', true).order('sort_order').limit(9);
        if (data?.length) {
          await lineClient.replyMessage({ replyToken, messages: [storeFlexMessage(data, settings?.value || '#')] as any });
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
