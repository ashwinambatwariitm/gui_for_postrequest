export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  try {
    const submissionUrl = "https://tds-llm-analysis.s-anand.net/submit";

    const response = await fetch(submissionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();

    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Proxy Error", details: err.toString() });
  }
}
