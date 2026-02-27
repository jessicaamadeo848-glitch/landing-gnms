export default async function handler(req, res) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          client_ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          client_user_agent: req.headers["user-agent"],
        },
      },
    ],
  };

  await fetch(
    `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  res.status(200).json({ success: true });
}
