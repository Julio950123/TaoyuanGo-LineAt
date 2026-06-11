import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../supabase';
import { authMiddleware } from '../services/auth';

export const uploadRouter = Router();
uploadRouter.use(authMiddleware);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

uploadRouter.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未提供圖片' });

  const ext = req.file.mimetype === 'image/png' ? 'png' : 'jpg';
  const path = `news/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(path, req.file.buffer, {
    contentType: req.file.mimetype,
    upsert: true,
  });

  if (error) return res.status(500).json({ error: error.message });

  const { data } = supabase.storage.from('images').getPublicUrl(path);
  res.json({ url: data.publicUrl });
});
