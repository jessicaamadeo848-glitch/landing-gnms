module.exports = async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method === "GET") {
      return res.status(200).json({
        ok: true,
        message: "API funcionando correctamente"
      });
    }

    if (req.method === "POST") {
      return res.status(200).json({
        ok: true,
        received: req.body
      });
    }

    return res.status(405).json({ error: "Method Not Allowed" });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
