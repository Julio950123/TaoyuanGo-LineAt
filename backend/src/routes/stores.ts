import { Router } from 'express';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const storesRouter = Router();
storesRouter.use(authMiddleware);

storesRouter.get('/', async (_req, res) => {
  const { data } = await supabase.from('stores').select('*').order('sort_order');
  res.json(data);
});

storesRouter.post('/', async (req, res) => {
  const { data, error } = await supabase.from('stores').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

storesRouter.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('stores').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

storesRouter.delete('/:id', async (req, res) => {
  await supabase.from('stores').delete().eq('id', req.params.id);
  res.json({ ok: true });
});
