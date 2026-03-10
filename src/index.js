export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Chỉ phục vụ đường dẫn /a/<code>.js
    const m = url.pathname.match(/^\/a\/([A-Za-z0-9_-]{2,32})\.js$/);
    if (!m) return new Response("", { status: 404 });

    const code = m[1];

    // ====== DATABASE DEMO (Bước 6 mình sẽ chuyển sang KV / JSON file) ======
    // Mỗi code ứng với 1 domain + 1 mức giây
    const db = {
      // ví dụ:
      // Ab3: { domain: "onepunchmantruyen.com", seconds: 60 }
      Ab3: { domain: "onepunchmantruyen.com", seconds: 60 },
    };

    const cfg = db[code];
    if (!cfg) return new Response("", { status: 404 });

    // ====== LOCK DOMAIN (chạy đúng site) ======
    const host = (request.headers.get("host") || "").toLowerCase();

    // Script được gọi từ ybctraffic.com (host) nhưng "site cần khóa" là domain page nhúng script
    // Nên ta dùng Referer để lấy hostname của trang nhúng script
    const referer = request.headers.get("referer") || "";
    let pageHost = "";
    try {
      pageHost = new URL(referer).hostname.toLowerCase();
    } catch {
      pageHost = "";
    }

    const allowed1 = cfg.domain.toLowerCase();
    const allowed2 = ("www." + cfg.domain).toLowerCase();

    if (pageHost !== allowed1 && pageHost !== allowed2) {
      return new Response("", { status: 403 });
    }

    // ====== CHỈ CHẠY KHI TỪ GOOGLE ======
    const ref = (request.headers.get("referer") || "").toLowerCase();

    // Lưu ý: với <script src=...> thì "referer" là URL trang nhúng script,
    // còn document.referrer (trong trình duyệt) mới là nguồn vào trang.
    // Nên ta kiểm tra Google ở client-side, giống code bạn đang làm.
    // Worker chỉ render script; việc check google sẽ nằm trong JS trả về.

    const seconds = Number(cfg.seconds) || 60;

    // ====== TRẢ VỀ SCRIPT JS ======
    const js = `
(function(){
  // ===== UI (HTML) =====
  var html = ${JSON.stringify(`
<div id="API_SEOTRAFFIC">
  <div id="traffic_box">
    <div class="logo_st">
      <img src="https://i.ibb.co/m50mvdpH/logo.png" alt="logo">
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
`)};  

  // chèn HTML vào DOM
  document.write(html);

  // ===== DOMAIN CHECK (client-side) =====
  var allowed = ${JSON.stringify([allowed1, allowed2])};
  if(allowed.indexOf(location.hostname) === -1){
    var el = document.getElementById("API_SEOTRAFFIC");
    if(el) el.style.display = "none";
    return;
  }

  // ===== CHỈ CHẠY KHI TỪ GOOGLE (client-side, giống bạn) =====
  var dref = (document.referrer || "").toLowerCase();
  if(dref.indexOf("google.") === -1){
    var el2 = document.getElementById("API_SEOTRAFFIC");
    if(el2) el2.style.display = "none";
    return;
  }

  // ===== RANDOM KEY =====
  function generateKey(){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    function part(){
      var s = "";
      for(var i=0;i<4;i++) s += chars[Math.floor(Math.random()*chars.length)];
      return s;
    }
    return "YBC-" + part() + "-" + part();
  }

  var waitTime = ${seconds};

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
    },1000);
  };

})();`;

    return new Response(js, {
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
};
