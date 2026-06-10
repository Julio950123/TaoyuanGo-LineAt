import { Router } from 'express';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const settingsRouter = Router();
settingsRouter.use(authMiddleware);

settingsRouter.get('/', async (_req, res) => {
  const { data } = await supabase.from('settings').select('*');
  const settings: Record<string, string> = {};
  data?.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

settingsRouter.put('/', async (req, res) => {
  const entries = Object.entries(req.body) as [string, string][];
  for (const [key, value] of entries) {
    await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
  }
  res.json({ ok: true });
});
