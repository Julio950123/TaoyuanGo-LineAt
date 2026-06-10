import { Router } from 'express';
import { supabase } from '../supabase';
import { hashPassword } from '../services/auth';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data } = await supabase
    .from('admins')
    .select('id, email, password_hash')
    .eq('email', email)
    .single();

  if (!data || data.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: '帳號或密碼錯誤' });
  }
  res.json({ token: data.id, email: data.email });
});
