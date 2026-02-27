const crypto = require("crypto");

function sha256(value) {
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

async function readJson(req) {
  // Si Vercel ya lo parseó, joya
  if (req.body && typeof req.body === "object") return req.body;

  // Si no, lo leemos crudo
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

module.exports = async (req, res) => {
  try {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    // ping
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, message: "API funcionando correctamente" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const body = await readJson(req);

    // 🔧 PONÉ TUS DATOS ACÁ
    const PIXEL_ID = "4267102870205197";
    const ACCESS_TOKEN = "EAATNLtCti8gBQ7BAaV2LfrY8TZBaSXTjItDDJZBipX5rf7ashudhcRHy1WqDN0Du2PvZCt018QnD7QZCzgqTvOpai2IaD8rkFqkZAb2ZBi9BUpJf3Mg7qJfq6gc13DC0X5WqdTF7jCcNyVtkLNl6qZAMpsRiCAVaLwOEzFmZCNzqOV6mNE5tJyC538WZAXNEmYVIVZAgZDZD";
    const TEST_EVENT_CODE = "TEST81889"; // el tuyo

    // Evento
    const event_name = body.event_name || "Lead";
    const event_source_url = body.event_source_url || "https://landing-gnms.vercel.app/";
    const client_user_agent = req.headers["user-agent"] || "";
    const client_ip_address =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "";

    // user_data mínimo (podés sumar email/phone si tenés)
    const user_data = {
      client_ip_address,
      client_user_agent,
      // Si algún día mandás email/phone, van hasheados:
      // em: sha256(body.email),
      // ph: sha256(body.phone),
    };

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url,
          user_data,
        },
      ],
      test_event_code: TEST_EVENT_CODE,
    };

    const fbUrl = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    const fbResp = await fetch(fbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const fbJson = await fbResp.json();

    return res.status(200).json({
      ok: true,
      sent: payload,
      facebook_status: fbResp.status,
      facebook_response: fbJson,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};
