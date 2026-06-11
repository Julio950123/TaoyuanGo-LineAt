import { Router } from 'express';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const footprintsRouter = Router();

// Public: record a visit (called from tracking script on public pages)
footprintsRouter.post('/track', async (req, res) => {
  const { uid, page, action } = req.body;
  if (!uid || !page) return res.status(400).json({ error: 'missing uid or page' });
  await supabase.from('footprints').insert({ line_user_id: uid, page, action: action || null });
  res.json({ ok: true });
});

// Admin: get footprints for a specific user
footprintsRouter.get('/user/:uid', authMiddleware, async (req, res) => {
  const { data } = await supabase.from('footprints').select('*')
    .eq('line_user_id', req.params.uid)
    .order('created_at', { ascending: false })
    .limit(50);
  res.json(data);
});

// Admin: get all footprints summary
footprintsRouter.get('/', authMiddleware, async (req, res) => {
  const { data } = await supabase.from('footprints').select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  res.json(data);
});
