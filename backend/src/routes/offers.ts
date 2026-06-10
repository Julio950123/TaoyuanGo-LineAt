import { Router } from 'express';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const offersRouter = Router();
offersRouter.use(authMiddleware);

offersRouter.get('/', async (_req, res) => {
  const { data } = await supabase
    .from('store_offers')
    .select('*, stores(name)')
    .order('created_at', { ascending: false });
  res.json(data);
});

offersRouter.post('/', async (req, res) => {
  const { data, error } = await supabase.from('store_offers').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

offersRouter.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('store_offers').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

offersRouter.delete('/:id', async (req, res) => {
  await supabase.from('store_offers').delete().eq('id', req.params.id);
  res.json({ ok: true });
});
