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
  // Tool UI chạy ở /tool. Admin key do bạn nhập tay (không hardcode).
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>YBC Traffic Tool</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:24px;color:#111;}
  .card{max-width:860px;margin:0 auto;border:1px solid #eee;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(0,0,0,.06);}
  h1{font-size:20px;margin:0 0 12px;}
  .row{display:flex;gap:12px;flex-wrap:wrap;margin:10px 0;}
  label{font-size:12px;color:#333;display:block;margin-bottom:6px;}
  input,select,button,textarea{font:inherit}
  input,select,textarea{width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:10px;outline:none}
  textarea{min-height:120px}
  .col{flex:1;min-width:240px}
  .btn{background:#0080FF;color:#fff;border:none;border-radius:10px;padding:10px 14px;cursor:pointer;font-weight:700}
  .btn:disabled{opacity:.55;cursor:not-allowed}
  .muted{color:#666;font-size:12px}
  .ok{color:#0a7a2f;font-weight:700}
  .err{color:#b00020;font-weight:700}
  code{background:#f6f6f6;padding:2px 6px;border-radius:8px}
</style>
</head>
<body>
  <div class="card">
    <h1>YBC Traffic Tool</h1>
    <div class="muted">Tạo mã cho khách mới: nhập <b>domain</b> + chọn <b>seconds</b> (60/90/150/180/300). Link cũ vẫn dùng bình thường.</div>

    <div class="row">
      <div class="col">
        <label>ADMIN_KEY (Bearer)</label>
        <input id="adminKey" type="password" placeholder="Nhập ADMIN_KEY để tạo mã" />
        <div class="muted">Không chia sẻ key này cho khách.</div>
      </div>
      <div class="col">
        <label>Domain khách</label>
        <input id="domain" placeholder="vd: onepunchmantruyen.com" />
      </div>
      <div class="col">
        <label>Seconds</label>
        <select id="seconds">
          <option value="60">60</option>
          <option value="90">90</option>
          <option value="150">150</option>
          <option value="180">180</option>
          <option value="300">300</option>
        </select>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <label>Logo URL (tuỳ chọn)</label>
        <input id="logoUrl" placeholder="Mặc định: https://i.ibb.co/m50mvdpH/logo.png" />
      </div>
      <div class="col">
        <label>Key Prefix (tuỳ chọn)</label>
        <input id="keyPrefix" placeholder='Mặc định: YBC-' />
      </div>
    </div>

    <div class="row">
      <button class="btn" id="btnCreate">TẠO CODE</button>
      <span id="status" class="muted"></span>
    </div>

    <div class="row">
      <div class="col">
        <label>Kết quả</label>
        <textarea id="out" readonly placeholder="Sẽ hiện code + scriptUrl + embed ở đây"></textarea>
        <div class="muted">Dòng embed gửi cho khách: <code>&lt;script src="...">&lt;/script></code></div>
      </div>
    </div>
  </div>

<script>
(function(){
  const $ = (id)=>document.getElementById(id);
  const statusEl = $("status");
  const out = $("out");

  // lưu adminKey tạm trong session tab (tuỳ bạn)
  const saved = sessionStorage.getItem("YBC_ADMIN_KEY");
  if(saved) $("adminKey").value = saved;

  function setStatus(msg, cls){
    statusEl.className = cls || "muted";
    statusEl.textContent = msg || "";
  }

  $("btnCreate").onclick = async function(){
    const adminKey = $("adminKey").value.trim();
    const domain = $("domain").value.trim();
    const seconds = Number($("seconds").value);
    const logoUrl = $("logoUrl").value.trim();
    const keyPrefix = $("keyPrefix").value.trim();

    if(!adminKey){ setStatus("Thiếu ADMIN_KEY", "err"); return; }
    if(!domain){ setStatus("Thiếu domain", "err"); return; }

    sessionStorage.setItem("YBC_ADMIN_KEY", adminKey);

    const payload = { domain, seconds };
    if(logoUrl) payload.logoUrl = logoUrl;
    if(keyPrefix) payload.keyPrefix = keyPrefix;

    $("btnCreate").disabled = true;
    setStatus("Đang tạo...", "muted");
    out.value = "";

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
        out.value = JSON.stringify(data, null, 2);
        return;
      }

      setStatus("OK! Tạo thành công", "ok");
      out.value = JSON.stringify(data, null, 2) + "\\n\\nEMBED:\\n" + data.embed;
    }catch(e){
      setStatus("Lỗi mạng / CORS: " + e.message, "err");
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
      const allowedSeconds = [60, 90, 150, 180, 300];

      if (!isValidDomain(domain)) return bad(400, "Invalid domain");
      if (!allowedSeconds.includes(seconds)) return bad(400, "seconds must be one of 60,90,150,180,300");

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
