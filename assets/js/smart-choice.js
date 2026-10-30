/* Smart Choice tools — shared, scoped, dependency-free */
(function () {
  "use strict";
  function init(root) {
    if (!root || root.dataset.scReady === "true") return;
    root.dataset.scReady = "true";
    const $ = (id) => root.querySelector("#" + id);
    const value = (id) => {
      const el = $(id);
      return el && el.value.trim() !== "" ? Number(el.value) : NaN;
    };
    const fmt = (n) => new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 }).format(n);
    const put = (id, text) => { const el = $(id); if (el) el.textContent = text; };
    function discount() {
      const price = value("sc-price"), rate = value("sc-rate");
      const valid = Number.isFinite(price) && Number.isFinite(rate) && price >= 0 && rate >= 0 && rate <= 100;
      put("sc-final", valid ? fmt(price * (1 - rate / 100)) : "تحقق من المدخلات");
      put("sc-discount-saved", valid ? fmt(price * rate / 100) : "—");
    }
    function budget() {
      const income = value("sc-income"), expenses = value("sc-expenses");
      const valid = Number.isFinite(income) && Number.isFinite(expenses) && income >= 0 && expenses >= 0;
      put("sc-balance", valid ? fmt(income - expenses) : "تحقق من المدخلات");
      put("sc-ratio", valid ? (income ? fmt(expenses / income * 100) + "%" : (expenses ? "غير متاح" : "0%")) : "—");
    }
    function unit() {
      const p1=value("sc-p1"), q1=value("sc-q1"), p2=value("sc-p2"), q2=value("sc-q2");
      const out=$("sc-unit-result");
      if (!out) return;
      if ([p1,q1,p2,q2].some(n => !Number.isFinite(n) || n < 0) || q1 === 0 || q2 === 0) {
        out.textContent = "أدخل أسعارًا غير سالبة وكميات أكبر من صفر.";
        return;
      }
      const a=p1/q1, b=p2/q2;
      const conclusion = Math.abs(a-b) < 1e-10 ? "السعر متساوٍ لكل وحدة" : a < b ? "المنتج الأول أوفر لكل وحدة" : "المنتج الثاني أوفر لكل وحدة";
      out.textContent = "سعر وحدة المنتج الأول: " + fmt(a) + " — سعر وحدة المنتج الثاني: " + fmt(b) + " — " + conclusion;
    }

    function percent() {
      const a=value("sc-base"), b=value("sc-new"), out=$("sc-percent-result");
      if(!out) return;
      out.textContent = Number.isFinite(a)&&Number.isFinite(b)&&a!==0 ? "التغير: "+fmt(b-a)+" — نسبة التغير: "+fmt((b-a)/Math.abs(a)*100)+"%" : "أدخل قيمتين صحيحتين، ويجب ألا تكون القيمة الأصلية صفرًا.";
    }
    function saving() {
      const target=value("sc-target"), saved=value("sc-saved"), monthly=value("sc-monthly"), out=$("sc-saving-result");
      if(!out)return;
      if([target,saved,monthly].some(n=>!Number.isFinite(n)||n<0)){out.textContent="أدخل أرقامًا غير سالبة.";return;}
      const remain=Math.max(0,target-saved);
      out.textContent=remain===0?"وصلت إلى هدفك أو تجاوزته.":monthly>0?"المتبقي: "+fmt(remain)+" — المدة المتوقعة: "+fmt(Math.ceil(remain/monthly))+" شهرًا.":"حدد ادخارًا شهريًا أكبر من صفر لحساب المدة.";
    }
    function total() {
      const vals=["sc-item","sc-shipping","sc-fees"].map(id=>value(id)), out=$("sc-total-result");
      if(!out)return;
      out.textContent=vals.every(n=>Number.isFinite(n)&&n>=0)?"التكلفة الإجمالية: "+fmt(vals.reduce((a,b)=>a+b,0)):"أدخل كل القيم كأرقام غير سالبة.";
    }
    function installment() {
      const cash=value("sc-cash"), down=value("sc-down"), months=value("sc-months"), pay=value("sc-monthpay"), out=$("sc-installment-result");
      if(!out)return;
      if([cash,down,months,pay].some(n=>!Number.isFinite(n)||n<0)||months<1||!Number.isInteger(months)||down>cash){out.textContent="راجع القيم؛ المقدم لا يتجاوز السعر النقدي وعدد الشهور عدد صحيح موجب.";return;}
      const totalPaid=down+months*pay, diff=totalPaid-cash;
      out.textContent="إجمالي المدفوع: "+fmt(totalPaid)+" — الفرق عن النقدي: "+fmt(diff)+(diff>0?" زيادة":diff<0?" أقل":" مساوي");
    }
    function convert() {
      const n=value("sc-convert-value"), type=$("sc-convert-type")?.value, out=$("sc-convert-result");
      if(!out)return;
      const factors={"kg-g":1000,"g-kg":.001,"l-ml":1000,"ml-l":.001,"m-cm":100,"cm-m":.01,"km-m":1000,"m-km":.001};
      out.textContent=Number.isFinite(n)&&Object.prototype.hasOwnProperty.call(factors,type)?"النتيجة: "+fmt(n*factors[type]):"أدخل قيمة صحيحة.";
    }
    function dates() {
      const a=$("sc-date1")?.value,b=$("sc-date2")?.value,out=$("sc-dates-result");
      if(!out)return;
      if(!a||!b){out.textContent="اختر التاريخين.";return;}
      const days=Math.abs(Date.parse(a+"T00:00:00Z")-Date.parse(b+"T00:00:00Z"))/86400000;
      out.textContent="الفارق بين التاريخين: "+fmt(days)+" يومًا.";
    }
    function vat() {
      const a=value("sc-vat-amount"), r=value("sc-vat-rate"), mode=$("sc-vat-mode")?.value, out=$("sc-vat-result");
      if(!out)return;
      if(!Number.isFinite(a)||!Number.isFinite(r)||a<0||r<0||r>100){out.textContent="أدخل مبلغًا ونسبة صحيحين (النسبة من 0 إلى 100).";return;}
      if(mode==="extract"){const net=a/(1+r/100);out.textContent="السعر قبل الضريبة: "+fmt(net)+" — قيمة الضريبة: "+fmt(a-net)+" — السعر النهائي: "+fmt(a);}
      else{const tax=a*r/100;out.textContent="قيمة الضريبة: "+fmt(tax)+" — السعر شاملًا الضريبة: "+fmt(a+tax);}
    }
    function compare() {
      const out=$("sc-compare-result"); if(!out)return;
      const get=(n)=>({p:value("sc-c-p"+n),e:value("sc-c-e"+n),l:value("sc-c-l"+n),w:value("sc-c-w"+n)});
      const x=get(1), y=get(2);
      const ok=(o)=>[o.p,o.l].every(n=>Number.isFinite(n)&&n>=0)&&o.l>0&&(!Number.isFinite(o.e)||o.e>=0)&&(!Number.isFinite(o.w)||o.w>=0);
      if(!ok(x)||!ok(y)){out.textContent="أدخل السعر وعمر الاستخدام (أكبر من صفر) لكل منتج.";return;}
      const cost=(o)=>(o.p+(Number.isFinite(o.e)?o.e:0));
      const ma=cost(x)/x.l, mb=cost(y)/y.l;
      let msg="التكلفة الشهرية للمنتج الأول: "+fmt(ma)+" — للمنتج الثاني: "+fmt(mb)+" — ";
      msg+=Math.abs(ma-mb)<1e-9?"التكلفة الشهرية متساوية.":ma<mb?"المنتج الأول أوفر شهريًا بفارق "+fmt(mb-ma)+".":"المنتج الثاني أوفر شهريًا بفارق "+fmt(ma-mb)+".";
      if(Number.isFinite(x.w)&&Number.isFinite(y.w)&&x.w!==y.w)msg+=" الضمان أطول للمنتج "+(x.w>y.w?"الأول":"الثاني")+".";
      out.textContent=msg;
    }
    function decide() {
      const out=$("sc-decide-result"); if(!out)return;
      const names=[0,1,2].map(j=>($("sc-d-o"+j)?.value||"").trim()||("الخيار "+(j+1)));
      const totals=[0,0,0]; let wsum=0, filled=false;
      for(let i=0;i<4;i++){
        const w=value("sc-d-w"+i); if(!Number.isFinite(w)||w<0||w>10) continue;
        wsum+=w;
        for(let j=0;j<3;j++){const sc=value("sc-d-s"+i+"-"+j); if(Number.isFinite(sc)&&sc>=0&&sc<=10){totals[j]+=w*sc; filled=true;}}
      }
      if(!filled||wsum===0){out.textContent="أدخل أوزانًا ودرجات بين 0 و10.";return;}
      const ranked=names.map((n,j)=>({n,v:totals[j]/wsum})).sort((a,b)=>b.v-a.v);
      out.textContent="الترتيب حسب أوزانك: "+ranked.map((r,k)=>(k+1)+") "+r.n+" ("+fmt(r.v)+" من 10)").join(" — ")+(ranked[0].v===ranked[1].v?" — تعادل بين الأول والثاني.":"");
    }
    const handlers = {
      "sc-price": discount, "sc-rate": discount,
      "sc-income": budget, "sc-expenses": budget,
      "sc-p1": unit, "sc-q1": unit, "sc-p2": unit, "sc-q2": unit,
      "sc-base": percent, "sc-new": percent,
      "sc-target": saving, "sc-saved": saving, "sc-monthly": saving,
      "sc-item": total, "sc-shipping": total, "sc-fees": total,
      "sc-cash": installment, "sc-down": installment, "sc-months": installment, "sc-monthpay": installment,
      "sc-convert-value": convert, "sc-date1": dates, "sc-date2": dates,
      "sc-vat-amount": vat, "sc-vat-rate": vat,
      "sc-c-p1": compare, "sc-c-e1": compare, "sc-c-l1": compare, "sc-c-w1": compare, "sc-c-p2": compare, "sc-c-e2": compare, "sc-c-l2": compare, "sc-c-w2": compare
    };
    Object.keys(handlers).forEach(id => {
      const el=$(id);
      if (el) el.addEventListener("input", handlers[id]);
    });
    const vatMode=$("sc-vat-mode"); if(vatMode) vatMode.addEventListener("change", vat);
    const decideBox=$("sc-decide"); if(decideBox) decideBox.addEventListener("input", decide);
    const convertType=$("sc-convert-type");
    if(convertType) convertType.addEventListener("change", convert);
    function showTab(tab) {
      const btn=root.querySelector('[data-tab="'+tab+'"]'); if(!btn) return;
      root.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-selected", String(b===btn)));
      root.querySelectorAll(".sc-tool").forEach(section => { section.hidden = section.id !== "sc-" + tab; });
    }
    root.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
      const tab=btn.getAttribute("data-tab"); showTab(tab);
      try { history.replaceState(null, "", "#" + tab); } catch (e) {}
    }));
    discount(); budget(); unit(); percent(); saving(); total(); installment(); convert(); dates(); vat(); compare(); decide();
    const fromHash=(location.hash||"").replace("#",""); if(fromHash) showTab(fromHash);
  }
  function start() {
    document.querySelectorAll(".sc-page").forEach(init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
/* Smart Choice — dynamic navigation, footer links and latest posts.
   Read from the blog's public feeds so new pages/posts appear without re-uploading the Blogger theme.
   Static markup in the theme remains as a fallback if a request fails. */
(function () {
  "use strict";
  var ORDER = ["الأدوات", "مقارنة", "مركز القرار", "من نحن", "اتصل بنا", "سياسة الخصوصية", "الشروط"];
  function clean(title) { return String(title || "").replace(/\s*\|\s*Smart Choice\s*$/i, "").trim(); }
  function rank(title) {
    for (var i = 0; i < ORDER.length; i++) if (title.indexOf(ORDER[i]) === 0) return i;
    return ORDER.length;
  }
  function link(url, text) { var a = document.createElement("a"); a.href = url; a.textContent = text; return a; }
  function entryUrl(e) {
    var l = (e.link || []).filter(function (x) { return x.rel === "alternate"; })[0];
    return l ? l.href : null;
  }
  function getJson(path) {
    return fetch(path, { credentials: "omit" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function pages() {
    return getJson("/feeds/pages/default?alt=json&max-results=50").then(function (d) {
      var list = ((d.feed && d.feed.entry) || []).filter(function (e) {
        // فقط صفحات Smart Choice: عنوانها ينتهي بـ "| Smart Choice"
        return /\|\s*Smart Choice\s*$/i.test((e.title && e.title.$t) || "");
      }).map(function (e) {
        return { title: clean(e.title && e.title.$t), url: entryUrl(e) };
      }).filter(function (p) { return p.title && p.url; });
      list.sort(function (a, b) { return rank(a.title) - rank(b.title); });
      return list;
    });
  }
  function fillNav(list) {
    var nav = document.querySelector(".sc-nav");
    if (nav && list.length) {
      var home = nav.querySelector("a");
      nav.textContent = "";
      if (home) nav.appendChild(home);
      list.forEach(function (p) { nav.appendChild(link(p.url, p.title)); });
    }
    var foot = document.querySelector(".sc-footlinks");
    if (foot && list.length) {
      foot.textContent = "";
      list.forEach(function (p) { foot.appendChild(link(p.url, p.title)); });
    }
  }
  function fillLatest() {
    var box = document.querySelector(".sc-latest-posts");
    if (!box) return;
    getJson("/feeds/posts/default?alt=json&max-results=6").then(function (d) {
      var items = ((d.feed && d.feed.entry) || []).filter(function (e) { return !/utilityra/i.test((e.title && e.title.$t) || ""); });
      if (!items.length) return;
      box.textContent = "";
      items.forEach(function (e) {
        var url = entryUrl(e); if (!url) return;
        var card = document.createElement("article"); card.className = "sc-card";
        var h = document.createElement("h3"); h.appendChild(link(url, e.title.$t));
        var p = document.createElement("p");
        var text = (e.summary && e.summary.$t) || String((e.content && e.content.$t) || "").replace(/<[^>]*>/g, " ");
        p.textContent = text.replace(/\s+/g, " ").trim().slice(0, 140);
        card.appendChild(h); card.appendChild(p); box.appendChild(card);
      });
    }).catch(function () {});
  }
  function start() {
    pages().then(fillNav).catch(function () {});
    fillLatest();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
