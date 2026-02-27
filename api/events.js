export default async function handler(req, res) {
  // Aceptar POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const PIXEL_ID = process.env.META_PIXEL_ID;         // 4267102870205197
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN; // tu token CAPI
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return res.status(500).json({ ok: false, error: 'Faltan variables META_PIXEL_ID / META_ACCESS_TOKEN' });
    }

    const { event_name = 'Lead', event_source_url, test_event_code } = req.body || {};

    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      '';

    const ua = req.headers['user-agent'] || '';

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: event_source_url || '',
          user_data: {
            client_ip_address: ip,
            client_user_agent: ua
          }
        }
      ]
    };

    if (test_event_code) payload.test_event_code = test_event_code;

    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await r.json();
    return res.status(200).json({ ok: true, meta: json });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
