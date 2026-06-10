import { Router } from 'express';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const newsRouter = Router();
newsRouter.use(authMiddleware);

newsRouter.get('/', async (_req, res) => {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
  res.json(data);
});

newsRouter.post('/', async (req, res) => {
  const { data, error } = await supabase.from('news').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

newsRouter.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('news').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

newsRouter.delete('/:id', async (req, res) => {
  await supabase.from('news').delete().eq('id', req.params.id);
  res.json({ ok: true });
});
