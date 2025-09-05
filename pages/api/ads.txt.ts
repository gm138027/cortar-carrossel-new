import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 设置正确的Content-Type
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  
  // 设置缓存头，让浏览器和CDN缓存ads.txt
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 24小时缓存
  
  // ads.txt内容
  const adsContent = 'google.com, pub-9027033456343227, DIRECT, f08c47fec0942fa0';
  
  res.status(200).send(adsContent);
}
