// Serverless API (Vercel) – proxy k OpenAI
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, history = [] } = req.body || {};
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  if (!message || typeof message !== "string") return res.status(400).json({ error: "Missing 'message' string" });

  const system = `
Jsi FinAsist, přátelský český finanční poradce.
Pomáháš s investicemi (ETF, dlouhodobé plánování), pojištěním, hypotékami, úvěry a spořením.
Odpovídej stručně, věcně, česky. Neposkytuj závazné daňové/právní rady.
Uveď rizika, neslibuj zaručené výnosy. Když dává smysl, nabídni konzultaci s Václavem Šedivým.
`;

  const messages = [
    { role: "system", content: system },
    ...history.slice(-8),
    { role: "user", content: message }
  ];

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    const reply = data?.choices?.[0]?.message?.content ?? "Omlouvám se, zkusím to prosím ještě jednou.";
    res.status(200).json({ reply, cta: process.env.CTA_URL || "" });
  } catch (e) {
    res.status(500).json({ error: e.message || "Upstream error" });
  }
}
