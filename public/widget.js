// Plovoucí bublina – vložíš do Wixu jako <script src=".../widget.js">
(function(){
  const cfg = {
    color: (document.currentScript?.dataset.color || "#9b4dff"),
    hover: (document.currentScript?.dataset.hover || "#7a3bcc"),
    theme: (document.currentScript?.dataset.theme || "light")
  };

  const btn = document.createElement("button");
  btn.id = "finasist-bubble";
  btn.setAttribute("aria-label", "Otevřít FinAsist chat");
  btn.style.cssText = [
    "position:fixed;right:22px;bottom:22px;z-index:999999;",
    "width:60px;height:60px;border-radius:999px;border:0;",
    `background:${cfg.color};color:#fff;`,
    "box-shadow:0 12px 30px rgba(155,77,255,.35);cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;",
    "font-size:26px;line-height:1;"
  ].join("");
  btn.innerHTML = "💬";
  btn.onmouseenter = () => btn.style.background = cfg.hover;
  btn.onmouseleave = () => btn.style.background = cfg.color;

  const wrap = document.createElement("div");
  wrap.id = "finasist-panel";
  wrap.style.cssText = [
    "position:fixed;right:22px;bottom:90px;z-index:999998;",
    "width:380px;height:560px;max-width:90vw;max-height:80vh;",
    "border-radius:18px;overflow:hidden;border:1px solid #e6e6ef;background:#fff;",
    "box-shadow:0 20px 60px rgba(0,0,0,.18);display:none;"
  ].join("");

  const iframe = document.createElement("iframe");
  const base = (document.currentScript?.src || "").split("/widget.js")[0];
  iframe.src = base + "/chat";
  iframe.title = "FinAsist – chat";
  iframe.style.cssText = "width:100%;height:100%;border:0;";
  wrap.appendChild(iframe);

  btn.onclick = () => wrap.style.display = (wrap.style.display === "none") ? "block" : "none";

  document.body.appendChild(btn);
  document.body.appendChild(wrap);

  window.addEventListener("keydown", e => { if (e.key === "Escape") wrap.style.display = "none"; });
})();
