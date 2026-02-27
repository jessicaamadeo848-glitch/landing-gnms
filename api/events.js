module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "API events funcionando"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {

    const PIXEL_ID = "4267102870205197";
    const ACCESS_TOKEN = "EAATNLtCti8gBQyEOvnvGVt3cvPNl40wrUji6Velw2oZA2ZB6REiGeeDZCY0DbcWEVaXzZCOMlrNYQeJdV1bJiXJw07av1iRyrUmjhwCNsoIoZAgFjdCJYAaFFajWmZBCGasm60BwntZCKlOrLmrPBOf00LXGUeyZBcZA1XPeOKOG42Ief7uqsCmpkaeG5aRjSidJrMgZDZD"

    const body = req.body || {};
    const test_event_code = body.test_event_code || null;

    const eventData = {
  data: [
    {
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: body.event_source_url || "https://landing-gnms.vercel.app",
      user_data: {
        client_ip_address:
          req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        client_user_agent: req.headers["user-agent"]
      }
    }
  ]
};
        
        }
      ]
    };

    if (test_event_code) {
      eventData.test_event_code = test_event_code;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData)
      }
    );

    const data = await response.json();

    return res.status(200).json({
      ok: true,
      facebook_response: data
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
