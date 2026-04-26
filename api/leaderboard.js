const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
const KEY = 'duality_lb_v1';
const MAX_SCORE = 9999999;
const MAX_ENTRIES = 100;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const lb = (await redis.get(KEY)) || [];
      return res.status(200).json(lb.slice(0, 20));
    } catch (e) {
      return res.status(500).json([]);
    }
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).end(); }
    }
    const { name, score } = body || {};
    const s = Number(score);
    if (!s || isNaN(s) || s <= 0 || s > MAX_SCORE) return res.status(400).end();
    const n = String(name || 'ANON').replace(/[<>"'&]/g, '').slice(0, 16).toUpperCase() || 'ANON';
    try {
      const lb = (await redis.get(KEY)) || [];
      lb.push({ name: n, score: Math.floor(s), date: new Date().toLocaleDateString('en-GB') });
      lb.sort((a, b) => b.score - a.score);
      await redis.set(KEY, lb.slice(0, MAX_ENTRIES));
      return res.status(200).json(lb.slice(0, 20));
    } catch (e) {
      return res.status(500).json([]);
    }
  }

  return res.status(405).end();
};
