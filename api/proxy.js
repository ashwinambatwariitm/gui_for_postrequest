export default async function handler(req, res) {
  // CORS
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
    // Your new requirement: extract dynamic submit_url
    const submit_url = req.body.submit_url;

    if (!submit_url) {
      return res.status(400).json({
        error: "submit_url field is required in the request body",
        received_body: req.body
      });
    }

    // Remove submit_url before forwarding to IITM server
    const { submit_url: _, ...forwardBody } = req.body;

    // Forward EXACT payload to IITM server
    const response = await fetch(submit_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwardBody)
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

// KEEP DEFAULT BODY PARSING (DO NOT CHANGE)
export const config = {
  api: {
    bodyParser: true
  }
};
