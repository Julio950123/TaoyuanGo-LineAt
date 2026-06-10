import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';
import crypto from 'crypto';

// Simple token-based auth: SHA256(email + password) stored in cookie/header
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '未登入' });

  const { data } = await supabase
    .from('admins')
    .select('id, email')
    .eq('id', token)
    .single();

  if (!data) return res.status(401).json({ error: '無效的 token' });
  (req as any).admin = data;
  next();
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
