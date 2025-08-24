import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [msgs, setMsgs] = useState([
    { who: "bot", text: "Ahoj! Jsem FinAsist. Pomohu ti s investicemi, pojištěním, hypotékou i plánem spoření. Napiš, co řešíš – začneme cílem a rozpočtem." }
  ]);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [msgs, typing]);

  async function send(e) {
    e.preventDefault();
    const val = inputRef.current.value.trim();
    if (!val) return;
    setMsgs(m => [...m, { who: "user", text: val }]);
    inputRef.current.value = "";
    setTyping(true);

    const history = msgs.map(m => ({ role: m.who === "user" ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch("/api/finasist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: val, history })
      });
      const data = await res.json();
      setTyping(false);
      if (!res.ok) throw new Error(data?.error || "API error");
      setMsgs(m => [...m, { who: "bot", text: data.reply }, ...(data.cta ? [{ who: "cta", text: data.cta }] : [])]);
    } catch {
      setTyping(false);
      setMsgs(m => [...m, { who: "bot", text: "Něco se nepovedlo. Zkusíme to za chvilku znovu." }]);
    }
  }

  return (
    <div className="wrap">
      <div className="card">
        <div className="header">
          <span className="dot"></span>
          <span className="title"><b>FinAsist</b> — online</span>
        </div>

        <div className="messages" ref={scrollRef}>
          {msgs.map((m, i) => (
            m.who === "cta" ? (
              <div className="cta" key={i}>
                <a className="ctaBtn" href={m.text} target="_blank" rel="noreferrer">Rezervovat konzultaci</a>
              </div>
            ) : (
              <div className={`msg ${m.who === "user" ? "user" : "bot"}`} key={i}>{m.text}</div>
            )
          ))}
          {typing && <div className="msg bot"><span className="dots"><span></span><span></span><span></span></span></div>}
        </div>

        <form className="form" onSubmit={send}>
          <input ref={inputRef} className="input" placeholder="Napiš dotaz… (např. Chci investovat 3 000 Kč měsíčně)" />
          <button className="send" type="submit">Odeslat</button>
        </form>

        <div className="legal">Používáním FinAsist souhlasíte se zpracováním osobních údajů dle Zásad ochrany osobních údajů.</div>
      </div>

      <style jsx>{`
        .wrap{max-width:900px;margin:0 auto;padding:12px;font-family:Inter,system-ui,Arial,sans-serif}
        .card{background:#fff;border:1px solid #e6e6ef;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.06);overflow:hidden}
        .header{display:flex;gap:10px;align-items:center;padding:14px 18px;border-bottom:1px solid #eee;background:#fafafa;color:#1e1e2e}
        .dot{width:10px;height:10px;border-radius:999px;background:#2ecc71;display:inline-block}
        .messages{padding:16px;max-height:70vh;overflow:auto;background:#fff}
        .msg{max-width:88%;padding:12px 14px;border-radius:16px;margin:10px 0;line-height:1.55;color:#1e1e2e}
        .bot{margin-right:auto;background:#f4efff;border:1px solid #e9dcff}
        .user{margin-left:auto;background:#f8f8fb;border:1px solid #e6e6ef}
        .form{display:flex;gap:10px;padding:12px;border-top:1px solid #eee;background:#fff}
        .input{flex:1;padding:12px 14px;border:1px solid #d9d9e6;border-radius:12px;outline:none}
        .input:focus{border-color:#9b4dff;box-shadow:0 0 0 3px rgba(155,77,255,.15)}
        .send{background:#9b4dff;color:#fff;border:0;border-radius:12px;padding:12px 18px;cursor:pointer;font-weight:600}
        .send:hover{background:#7a3bcc}
        .legal{font-size:12px;color:#6b6b7a;padding:0 16px 14px}
        .cta{display:flex;justify-content:flex-start}
        .ctaBtn{background:#1e1e2e;color:#fff;text-decoration:none;border-radius:12px;padding:10px 14px;display:inline-block}
        .ctaBtn:hover{opacity:.9}
        .dots span{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:#9b4dff;animation:b .9s infinite alternate}
        .dots span:nth-child(2){animation-delay:.15s}
        .dots span:nth-child(3){animation-delay:.3s}
        @keyframes b{from{opacity:.3;transform:translateY(0)}to{opacity:1;transform:translateY(-3px)}}
      `}</style>
    </div>
  );
}
