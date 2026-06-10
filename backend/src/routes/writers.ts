import { Router } from 'express';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const writersRouter = Router();
writersRouter.use(authMiddleware);

writersRouter.get('/', async (_req, res) => {
  const { data } = await supabase.from('writers').select('*').order('sort_order');
  res.json(data);
});

writersRouter.post('/', async (req, res) => {
  const { data, error } = await supabase.from('writers').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

writersRouter.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('writers').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

writersRouter.delete('/:id', async (req, res) => {
  await supabase.from('writers').delete().eq('id', req.params.id);
  res.json({ ok: true });
});
