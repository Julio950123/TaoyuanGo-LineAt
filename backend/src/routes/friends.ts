import { Router } from 'express';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const friendsRouter = Router();
friendsRouter.use(authMiddleware);

friendsRouter.get('/', async (_req, res) => {
  const { data } = await supabase.from('line_friends').select('*').order('followed_at', { ascending: false });
  res.json(data);
});

friendsRouter.patch('/:id', async (req, res) => {
  const { real_name, phone, note } = req.body;
  const update: any = {};
  if (real_name !== undefined) update.real_name = real_name;
  if (phone !== undefined) update.phone = phone;
  if (note !== undefined) update.note = note;
  const { error } = await supabase.from('line_friends').update(update).eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});
