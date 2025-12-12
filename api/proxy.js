export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { submit_url, ...rest } = req.body;

    if (!submit_url) {
      return res.status(400).json({
        error: "submit_url field is required in the request body"
      });
    }

    const response = await fetch(submit_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest)
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Proxy error",
      details: err.toString()
    });
  }
}
