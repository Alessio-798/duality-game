const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KEY = 'duality_lb_v2';
const MAX_SCORE = 9999999;
const MAX_ENTRIES = 400000;

async function getTop10() {
  const members = await redis.zrange(KEY, 0, 9, { rev: true });
  if (!members || !members.length) return [];
  const pipe = redis.pipeline();
  members.forEach(m => pipe.zscore(KEY, m));
  const scores = await pipe.exec();
  return members.map((m, i) => ({
    name: String(m).split('|')[0],
    score: Number(scores[i]),
  }));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      return res.status(200).json(await getTop10());
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
      const count = await redis.zcard(KEY);

      if (count >= MAX_ENTRIES) {
        const minArr = await redis.zrange(KEY, 0, 0);
        if (minArr && minArr.length) {
          const minScore = Number(await redis.zscore(KEY, minArr[0]));
          if (s <= minScore) {
            return res.status(200).json({ tooLow: true });
          }
          await redis.zpopmin(KEY, 1);
        }
      }

      const member = `${n}|${Date.now()}`;
      await redis.zadd(KEY, { score: s, member });

      const revRank = await redis.zrevrank(KEY, member);
      const myRank = revRank !== null ? revRank + 1 : null;
      const lb = await getTop10();

      return res.status(200).json({ lb, myRank });
    } catch (e) {
      return res.status(500).json({ lb: [] });
    }
  }

  return res.status(405).end();
};
