function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
function bad(status, msg) {
  return json({ ok: false, error: msg }, status);
}

function normalizeDomain(d) {
  return String(d || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}
function isValidDomain(d) {
  return /^[a-z0-9.-]+$/.test(d) && d.includes(".") && !d.startsWith(".") && !d.endsWith(".");
}
function genCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function uiHtmlCss(logoUrl) {
  return `
<div id="API_SEOTRAFFIC">
  <div id="traffic_box">
    <div class="logo_st">
      <img src="${logoUrl}" alt="logo">
    </div>
    <button id="getKeyBtn">LẤY KEY</button>
    <div id="countdown" style="display:none;"></div>
    <div id="result" style="display:none;"></div>
  </div>
</div>

<style>
#API_SEOTRAFFIC{margin-bottom:30px;background:#fff;border:1px solid rgba(129,0,0,0.12);border-radius:12px;padding:8px 12px;display:inline-block;box-shadow:0 3px 10px rgba(255,77,77,0.3);z-index:999999;max-width:100%;}
#traffic_box{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.logo_st{width:100px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0;}
.logo_st img{width:100%;height:100%;object-fit:cover;}
#getKeyBtn{font-size:13px;color:#fff;font-weight:bold;padding:6px 12px;background:#0080FF;border-radius:6px;border:none;cursor:pointer;}
#countdown{font-size:12px;font-weight:bold;color:#333;}
#result{font-size:12px;font-weight:bold;color:#00a651;word-break:break-all;}
@media(max-width:600px){
  #API_SEOTRAFFIC{width:100%;text-align:center;}
  #traffic_box{display:flex;align-items:center;justify-content:center;gap:12px;}
  #getKeyBtn{font-size:12px;color:#fff;font-weight:bold;padding:6px 12px;background:#ff4d4d;border-radius:6px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;}
}
</style>
`;
}

function jsPayload({ allowedDomains, waitTime, keyPrefix, logoUrl }) {
  const html = uiHtmlCss(logoUrl);

  return `
(function(){
  document.write(${JSON.stringify(html)});

  // ===== DOMAIN LOCK =====
  var allowed = ${JSON.stringify(allowedDomains)};
  if(allowed.indexOf(location.hostname) === -1){
    var el = document.getElementById("API_SEOTRAFFIC");
    if(el) el.style.display="none";
    return;
  }

  // ===== ONLY GOOGLE REFERRER (client-side) =====
  var dr = (document.referrer || "").toLowerCase();
  if(dr.indexOf("google.") === -1){
    var el2 = document.getElementById("API_SEOTRAFFIC");
    if(el2) el2.style.display="none";
    return;
  }

  // ===== RANDOM KEY =====
  function generateKey(){
    var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    function part(){
      var s=""; for(var i=0;i<4;i++) s += chars[Math.floor(Math.random()*chars.length)];
      return s;
    }
    return ${JSON.stringify(keyPrefix)} + part() + "-" + part();
  }

  var waitTime = ${Number(waitTime) || 60};
  var button = document.getElementById("getKeyBtn");
  var countdown = document.getElementById("countdown");
  var result = document.getElementById("result");
  if(!button || !countdown || !result) return;

  button.onclick = function(){
    button.style.display="none";
    countdown.style.display="block";
    var time = waitTime;
    countdown.innerHTML = "Vui lòng chờ: " + time + "s";
    var timer = setInterval(function(){
      time--;
      countdown.innerHTML = "Vui lòng chờ: " + time + "s";
      if(time <= 0){
        clearInterval(timer);
        countdown.style.display="none";
        result.style.display="block";
        result.innerHTML = "KEY: " + generateKey();
      }
    }, 1000);
  };
})();`;
}

function toolHtml(origin) {
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>YBC Traffic Tool</title>
<style>
  :root{
    --bg:#0b1020;
    --card:rgba(255,255,255,.06);
    --card2:rgba(255,255,255,.08);
    --text:#eef2ff;
    --muted:rgba(238,242,255,.7);
    --line:rgba(255,255,255,.12);
    --blue:#3b82f6;
    --green:#22c55e;
    --red:#ef4444;
    --shadow:0 20px 60px rgba(0,0,0,.35);
    --radius:16px;
  }
  *{box-sizing:border-box}
  body{
    margin:0; padding:28px;
    font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
    color:var(--text);
    background:
      radial-gradient(1000px 500px at 20% -10%, rgba(59,130,246,.35), transparent 60%),
      radial-gradient(900px 500px at 90% 10%, rgba(34,197,94,.22), transparent 60%),
      var(--bg);
  }
  .wrap{max-width:980px;margin:0 auto}
  .top{
    display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;
    margin-bottom:14px;
  }
  h1{font-size:20px;margin:0}
  .sub{color:var(--muted);font-size:12px;line-height:1.4;margin-top:6px}
  .badge{
    display:inline-flex;align-items:center;gap:8px;
    padding:8px 10px;border:1px solid var(--line);
    border-radius:999px;background:rgba(255,255,255,.05);
    color:var(--muted);font-size:12px;
  }
  .grid{display:grid;grid-template-columns:1fr;gap:14px}
  @media(min-width:900px){ .grid{grid-template-columns: 1.1fr .9fr} }
  .card{
    border:1px solid var(--line);
    background:linear-gradient(180deg,var(--card),rgba(255,255,255,.03));
    border-radius:var(--radius);
    box-shadow:var(--shadow);
    padding:16px;
  }
  .title{font-weight:800;font-size:13px;margin:0 0 12px;color:rgba(238,242,255,.9)}
  .row{display:grid;grid-template-columns:1fr;gap:10px}
  @media(min-width:700px){ .row{grid-template-columns:1fr 1fr} }
  label{display:block;font-size:12px;color:var(--muted);margin:2px 0 6px}
  input,select,textarea{
    width:100%;
    border:1px solid var(--line);
    background:rgba(255,255,255,.04);
    color:var(--text);
    padding:10px 12px;border-radius:12px;
    outline:none;
  }
  select{color-scheme:dark}
  select option{background:#fff;color:#111}
  select optgroup{background:#0b1020;color:#eef2ff}
  input::placeholder,textarea::placeholder{color:rgba(238,242,255,.45)}
  textarea{min-height:130px;resize:vertical}
  .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
  .btn{
    border:1px solid var(--line);
    background:rgba(255,255,255,.06);
    color:var(--text);
    padding:10px 12px;border-radius:12px;
    cursor:pointer;font-weight:800;font-size:13px;
    display:inline-flex;align-items:center;gap:8px;
  }
  .btn.primary{background:linear-gradient(180deg,rgba(59,130,246,.95),rgba(37,99,235,.95)); border-color:rgba(59,130,246,.55)}
  .btn.success{background:linear-gradient(180deg,rgba(34,197,94,.95),rgba(22,163,74,.95)); border-color:rgba(34,197,94,.55)}
  .btn:disabled{opacity:.55;cursor:not-allowed}
  .hint{color:var(--muted);font-size:12px;margin-top:10px;line-height:1.5}
  .outbox{
    border:1px dashed rgba(255,255,255,.22);
    background:rgba(255,255,255,.03);
    border-radius:14px;padding:12px;margin-top:10px;
  }
  .kv{
    display:grid;grid-template-columns:1fr;gap:10px;margin-top:10px
  }
  .kv .item{border:1px solid var(--line);background:rgba(255,255,255,.04);border-radius:14px;padding:12px}
  .kv .k{font-size:12px;color:var(--muted);margin-bottom:6px}
  .kv .v{
    font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
    font-size:12.5px;word-break:break-all;line-height:1.5
  }
  .toast{
    position:fixed;right:16px;bottom:16px;
    background:rgba(0,0,0,.75);
    border:1px solid rgba(255,255,255,.18);
    color:var(--text);
    padding:10px 12px;border-radius:12px;
    font-size:12px;display:none;max-width:320px
  }
  .ok{color:var(--green);font-weight:800}
  .err{color:var(--red);font-weight:800}
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <h1>YBC Traffic Tool</h1>
        <div class="sub">Tạo code theo đơn hàng: nhập <b>domain</b> + chọn <b>seconds</b> (60/90/120/150/180/300) → nhận <b>Script URL</b> và <b>Embed</b>. Khách cũ dùng link cũ vì config lưu KV.</div>
      </div>
      <div class="badge">Endpoint: <span style="font-family:ui-monospace">/admin/create</span> • Tool: <span style="font-family:ui-monospace">/tool</span></div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="title">Tạo code</div>

        <div class="row">
          <div>
            <label>ADMIN_KEY (Bearer)</label>
            <input id="adminKey" type="password" placeholder="Nhập ADMIN_KEY để tạo mã" />
          </div>
          <div>
            <label>Domain khách</label>
            <input id="domain" placeholder="vd: thamtuconan.net" />
          </div>
        </div>

        <div class="row">
          <div>
            <label>Seconds</label>
            <select id="seconds">
              <option value="60">60</option>
              <option value="90" selected>90</option>
              <option value="120">120</option>
              <option value="150">150</option>
              <option value="180">180</option>
              <option value="300">300</option>
            </select>
          </div>
          <div>
            <label>Logo URL (tuỳ chọn)</label>
            <input id="logoUrl" placeholder="Mặc định: https://i.ibb.co/m50mvdpH/logo.png" />
          </div>
        </div>

        <div class="row">
          <div>
            <label>Key Prefix (tuỳ chọn)</label>
            <input id="keyPrefix" placeholder="Mặc định: YBC-" />
          </div>
          <div>
            <label>Trạng thái</label>
            <input id="status" readonly value="Sẵn sàng" />
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" id="btnCreate">TẠO CODE</button>
          <button class="btn" id="btnClear">XÓA KẾT QUẢ</button>
        </div>

        <div class="hint">
          • Script chỉ chạy đúng domain đã đăng ký và chỉ hiện box khi <b>document.referrer</b> có <b>google.</b><br>
          • Mở trực tiếp <b>/a/code.js</b> có thể bị 403 là bình thường (thiếu Referer).
        </div>
      </div>

      <div class="card">
        <div class="title">Kết quả</div>

        <div class="kv">
          <div class="item">
            <div class="k">Code</div>
            <div class="v" id="vCode">—</div>
          </div>

          <div class="item">
            <div class="k">Script URL (copy gửi kỹ thuật)</div>
            <div class="v" id="vScript">—</div>
            <div class="actions">
              <button class="btn success" id="copyScript" disabled>COPY URL</button>
            </div>
          </div>

          <div class="item">
            <div class="k">Embed (copy gửi khách)</div>
            <div class="v" id="vEmbed">—</div>
            <div class="actions">
              <button class="btn success" id="copyEmbed" disabled>COPY EMBED</button>
            </div>
          </div>
        </div>

        <div class="outbox">
          <div class="k" style="color:var(--muted);font-size:12px;margin-bottom:6px">JSON response</div>
          <textarea id="out" readonly placeholder="JSON sẽ hiển thị ở đây"></textarea>
        </div>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

<script>
(function(){
  const $ = (id)=>document.getElementById(id);
  const toast = $("toast");

  function showToast(msg){
    toast.textContent = msg;
    toast.style.display="block";
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(()=>toast.style.display="none", 1800);
  }

  function setStatus(text, type){
    $("status").value = text;
    $("status").style.borderColor = type==="err" ? "rgba(239,68,68,.55)" : type==="ok" ? "rgba(34,197,94,.55)" : "rgba(255,255,255,.12)";
  }

  const saved = sessionStorage.getItem("YBC_ADMIN_KEY");
  if(saved) $("adminKey").value = saved;

  function setResult(data){
    const code = data && data.code ? data.code : "";
    const scriptUrl = data && data.scriptUrl ? data.scriptUrl : "";
    const embed = data && data.embed ? data.embed : "";

    $("vCode").textContent = code || "—";
    $("vScript").textContent = scriptUrl || "—";
    $("vEmbed").textContent = embed || "—";

    $("copyScript").disabled = !scriptUrl;
    $("copyEmbed").disabled = !embed;

    $("out").value = data ? JSON.stringify(data, null, 2) : "";
  }

  async function copyText(text){
    try{
      await navigator.clipboard.writeText(text);
      showToast("Đã copy!");
    }catch{
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      ta.remove();
      showToast("Đã copy!");
    }
  }

  $("copyScript").onclick = ()=>copyText($("vScript").textContent);
  $("copyEmbed").onclick = ()=>copyText($("vEmbed").textContent);

  $("btnClear").onclick = ()=>{
    setResult(null);
    setStatus("Sẵn sàng", "");
    showToast("Đã xóa kết quả");
  };

  $("btnCreate").onclick = async ()=>{
    const adminKey = $("adminKey").value.trim();
    const domain = $("domain").value.trim();
    const seconds = Number($("seconds").value);
    const logoUrl = $("logoUrl").value.trim();
    const keyPrefix = $("keyPrefix").value.trim();

    if(!adminKey){ setStatus("Thiếu ADMIN_KEY", "err"); showToast("Thiếu ADMIN_KEY"); return; }
    if(!domain){ setStatus("Thiếu domain", "err"); showToast("Thiếu domain"); return; }

    sessionStorage.setItem("YBC_ADMIN_KEY", adminKey);

    const payload = { domain, seconds };
    if(logoUrl) payload.logoUrl = logoUrl;
    if(keyPrefix) payload.keyPrefix = keyPrefix;

    $("btnCreate").disabled = true;
    setStatus("Đang tạo...", "");
    setResult(null);

    try{
      const res = await fetch("${origin}/admin/create", {
        method: "POST",
        headers: {
          "content-type":"application/json",
          "authorization":"Bearer " + adminKey
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(()=>null);

      if(!res.ok){
        setStatus("Lỗi: " + (data && data.error ? data.error : res.status), "err");
        $("out").value = data ? JSON.stringify(data, null, 2) : "";
        showToast("Tạo thất bại");
        return;
      }

      setStatus("OK - Tạo thành công", "ok");
      setResult(data);
      showToast("Tạo thành công");
    }catch(e){
      setStatus("Lỗi mạng: " + e.message, "err");
      showToast("Lỗi mạng");
    }finally{
      $("btnCreate").disabled = false;
    }
  };
})();
</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // -------- TOOL UI --------
    if (path === "/tool") {
      return new Response(toolHtml(url.origin), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      });
    }

    // -------- ADMIN AUTH --------
    const auth = request.headers.get("authorization") || "";
    const isAdmin = auth.startsWith("Bearer ") && auth.slice(7) === env.ADMIN_KEY;

    // -------- CREATE CODE --------
    if (path === "/admin/create") {
      if (request.method !== "POST") return bad(405, "Use POST");
      if (!isAdmin) return bad(401, "Unauthorized");

      let body;
      try { body = await request.json(); }
      catch { return bad(400, "Body must be JSON"); }

      const domain = normalizeDomain(body.domain);
      const seconds = Number(body.seconds);
      const allowedSeconds = [60, 90, 120, 150, 180, 300];

      if (!isValidDomain(domain)) return bad(400, "Invalid domain");
      if (!allowedSeconds.includes(seconds)) return bad(400, "seconds must be one of 60,90,120,150,180,300");

      const logoUrl = (body.logoUrl || "https://i.ibb.co/m50mvdpH/logo.png").trim();
      const keyPrefix = (body.keyPrefix || "YBC-").trim();

      // tạo code không trùng
      let code = "";
      for (let i = 0; i < 10; i++) {
        const cand = genCode(6);
        const exists = await env.YBC_KV.get(`cfg:${cand}`);
        if (!exists) { code = cand; break; }
      }
      if (!code) return bad(500, "Could not allocate code");

      const cfg = {
        domain,
        seconds,
        active: true,
        createdAt: new Date().toISOString(),
        logoUrl,
        keyPrefix,
      };

      await env.YBC_KV.put(`cfg:${code}`, JSON.stringify(cfg));

      const scriptUrl = `${url.origin}/a/${code}.js`;
      return json({
        ok: true,
        code,
        config: cfg,
        scriptUrl,
        embed: `<script src="${scriptUrl}"></script>`,
      });
    }

    // -------- TOGGLE (optional) --------
    if (path === "/admin/toggle") {
      if (request.method !== "POST") return bad(405, "Use POST");
      if (!isAdmin) return bad(401, "Unauthorized");

      let body;
      try { body = await request.json(); } catch { return bad(400, "Body must be JSON"); }
      const code = String(body.code || "").trim();
      const active = Boolean(body.active);

      const raw = await env.YBC_KV.get(`cfg:${code}`);
      if (!raw) return bad(404, "Code not found");
      const cfg = JSON.parse(raw);
      cfg.active = active;
      cfg.updatedAt = new Date().toISOString();
      await env.YBC_KV.put(`cfg:${code}`, JSON.stringify(cfg));
      return json({ ok: true, code, active });
    }

    // -------- SERVE SCRIPT --------
    const m = path.match(/^\/a\/([A-Za-z0-9_-]{2,32})\.js$/);
    if (m) {
      const code = m[1];
      const raw = await env.YBC_KV.get(`cfg:${code}`);
      if (!raw) return new Response("", { status: 404 });

      const cfg = JSON.parse(raw);
      if (!cfg.active) return new Response("", { status: 403 });

      // Lock theo trang nhúng script: dùng Referer header
      const referer = request.headers.get("referer") || "";
      let pageHost = "";
      try { pageHost = new URL(referer).hostname.toLowerCase(); } catch {}

      const d1 = String(cfg.domain || "").toLowerCase();
      const d2 = ("www." + d1).toLowerCase();

      if (pageHost !== d1 && pageHost !== d2) return new Response("", { status: 403 });

      const js = jsPayload({
        allowedDomains: [d1, d2],
        waitTime: cfg.seconds,
        keyPrefix: cfg.keyPrefix || "YBC-",
        logoUrl: cfg.logoUrl || "https://i.ibb.co/m50mvdpH/logo.png",
      });

      return new Response(js, {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    return new Response("YBC Traffic Worker running. Open /tool", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
