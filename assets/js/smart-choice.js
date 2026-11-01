/* Smart Choice — أحدث CSS دائماً: يُحقن من GitHub مباشرة لتجاوز كاش CDN القديم */
(function () {
  "use strict";
  try {
    var key = Math.floor(Date.now() / 300000);
    fetch("https://raw.githubusercontent.com/tahattaha41/Smart-Choice/main/assets/css/smart-choice.css?t=" + key, { credentials: "omit" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (css) {
        css = css.split("\n").filter(function (l) { return l.indexOf("@import") !== 0; }).join("\n");
        var st = document.getElementById("sc-css-live");
        if (!st) { st = document.createElement("style"); st.id = "sc-css-live"; document.head.appendChild(st); }
        st.textContent = css;
        if (!document.getElementById("sc-font-live")) { var fl = document.createElement("link"); fl.id = "sc-font-live"; fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"; document.head.appendChild(fl); }
      }).catch(function () {});
  } catch (e) {}
})();

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
      const empty = !Number.isFinite(price) && !Number.isFinite(rate);
      put("sc-final", valid ? fmt(price * (1 - rate / 100)) : (empty ? "أدخل البيانات" : "تحقق من المدخلات"));
      put("sc-discount-saved", valid ? fmt(price * rate / 100) : "—");
    }
    function budget() {
      const income = value("sc-income"), expenses = value("sc-expenses");
      const valid = Number.isFinite(income) && Number.isFinite(expenses) && income >= 0 && expenses >= 0;
      const emptyB = !Number.isFinite(income) && !Number.isFinite(expenses);
      put("sc-balance", valid ? fmt(income - expenses) : (emptyB ? "أدخل البيانات" : "تحقق من المدخلات"));
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
      out.textContent="";
      ranked.forEach((r,k)=>{
        const row=document.createElement("div"); row.className="rank"+(k===0?" first":"");
        const name=document.createElement("span"); name.className="rname"; name.textContent=(k+1)+") "+r.n;
        const bar=document.createElement("span"); bar.className="rbar"; const fill=document.createElement("i"); fill.style.width=Math.max(2,r.v*10)+"%"; bar.appendChild(fill);
        const val=document.createElement("b"); val.textContent=fmt(r.v)+" / 10";
        row.appendChild(name); row.appendChild(bar); row.appendChild(val); out.appendChild(row);
      });
      if(ranked[0].v===ranked[1].v){const n=document.createElement("p"); n.className="rnote"; n.textContent="تعادل بين الأول والثاني؛ راجع الأوزان أو أضف معياراً."; out.appendChild(n);}
    }
    function loan() {
      const P=value("sc-loan-amount"), ar=value("sc-loan-rate"), n=value("sc-loan-months"), out=$("sc-loan-result"); if(!out)return;
      if(![P,ar,n].every(Number.isFinite)||P<=0||ar<0||ar>100||n<1||!Number.isInteger(n)){out.textContent="أدخل مبلغاً أكبر من صفر، وفائدة من 0 إلى 100، ومدة بالأشهر (عدد صحيح).";return;}
      const r=ar/12/100, pay=r===0?P/n:P*r/(1-Math.pow(1+r,-n)), total=pay*n;
      out.textContent="القسط الشهري: "+fmt(pay)+" — إجمالي المدفوع: "+fmt(total)+" — إجمالي الفوائد: "+fmt(total-P);
    }
    function margin() {
      const c=value("sc-margin-cost"), p=value("sc-margin-price"), out=$("sc-margin-result"); if(!out)return;
      if(![c,p].every(Number.isFinite)||c<0||p<=0){out.textContent="أدخل تكلفة غير سالبة وسعر بيع أكبر من صفر.";return;}
      const profit=p-c;
      out.textContent="الربح: "+fmt(profit)+" — هامش الربح: "+fmt(profit/p*100)+"%"+(c>0?" — نسبة الزيادة على التكلفة: "+fmt(profit/c*100)+"%":"");
    }
    function split() {
      const t=value("sc-split-total"), tip=Number.isFinite(value("sc-split-tip"))?value("sc-split-tip"):0, n=value("sc-split-people"), out=$("sc-split-result"); if(!out)return;
      if(!Number.isFinite(t)||t<0||tip<0||!Number.isFinite(n)||n<1||!Number.isInteger(n)){out.textContent="أدخل إجمالياً غير سالب، وعدد أشخاص صحيحاً (1 أو أكثر).";return;}
      const all=t*(1+tip/100);
      out.textContent="الإجمالي مع الإكرامية: "+fmt(all)+" — نصيب كل شخص: "+fmt(all/n);
    }
    function compound() {
      const P=value("sc-cp-start"), M=Number.isFinite(value("sc-cp-add"))?value("sc-cp-add"):0, R=value("sc-cp-rate"), Y=value("sc-cp-years"), out=$("sc-compound-result"); if(!out)return;
      if(![P,R,Y].every(Number.isFinite)||P<0||M<0||R<0||Y<=0||Y>80){out.textContent="أدخل مبلغاً غير سالب، وعائداً غير سالب، ومدة بين 1 و80 سنة.";return;}
      const n=Math.round(Y*12), r=R/100/12;
      const g=r===0?1:Math.pow(1+r,n);
      const fv=P*g+M*(r===0?n:(g-1)/r), paid=P+M*n;
      out.textContent="القيمة بعد المدة: "+fmt(fv)+" — إجمالي ما أودعته: "+fmt(paid)+" — العائد المفترض: "+fmt(fv-paid);
    }
    function breakeven() {
      const F=value("sc-be-fixed"), p=value("sc-be-price"), v=Number.isFinite(value("sc-be-var"))?value("sc-be-var"):0, out=$("sc-breakeven-result"); if(!out)return;
      if(!Number.isFinite(F)||!Number.isFinite(p)||F<0||p<=0||v<0){out.textContent="أدخل تكاليف ثابتة غير سالبة وسعر بيع أكبر من صفر.";return;}
      if(p<=v){out.textContent="سعر البيع يجب أن يكون أكبر من التكلفة المتغيرة وإلا لن تتحقق نقطة تعادل.";return;}
      const u=Math.ceil(F/(p-v));
      out.textContent="الوحدات المطلوبة للتعادل: "+fmt(u)+" — الإيراد عند التعادل: "+fmt(u*p)+" — ربح كل وحدة: "+fmt(p-v);
    }
    function hourly() {
      const I=value("sc-hr-income"), h=value("sc-hr-hours"), d=value("sc-hr-days"), pr=value("sc-hr-price"), out=$("sc-hourly-result"); if(!out)return;
      if(![I,h,d].every(Number.isFinite)||I<=0||h<=0||h>24||d<=0||d>7){out.textContent="أدخل دخلاً أكبر من صفر، وساعات (1–24) وأياماً (1–7).";return;}
      const hrs=h*d*52/12, rate=I/hrs;
      let t="قيمة الساعة: "+fmt(rate)+" — ساعات العمل الشهرية: "+fmt(hrs);
      if(Number.isFinite(pr)&&pr>0) t+=" — سعر المنتج بساعات عملك: "+fmt(pr/rate)+" ساعة";
      out.textContent=t;
    }
    function trip() {
      const km=value("sc-trip-km"), c=value("sc-trip-cons"), pr=value("sc-trip-price"), n=Number.isFinite(value("sc-trip-people"))?value("sc-trip-people"):1, way=Number(($("sc-trip-way")||{}).value||1), out=$("sc-trip-result"); if(!out)return;
      if(![km,c,pr].every(Number.isFinite)||km<=0||c<=0||pr<0||n<1||!Number.isInteger(n)){out.textContent="أدخل مسافة واستهلاكاً أكبر من صفر، وعدد ركاب صحيحاً.";return;}
      const liters=km*way*c/100, cost=liters*pr;
      out.textContent="الوقود اللازم: "+fmt(liters)+" لتر — تكلفة الوقود: "+fmt(cost)+" — نصيب كل راكب: "+fmt(cost/n);
    }
    function fx() {
      const a=value("sc-fx-amount"), r=value("sc-fx-rate"), fee=Number.isFinite(value("sc-fx-fee"))?value("sc-fx-fee"):0, out=$("sc-fx-result"); if(!out)return;
      if(![a,r].every(Number.isFinite)||a<0||r<=0||fee<0||fee>=100){out.textContent="أدخل مبلغاً غير سالب وسعر صرف أكبر من صفر وعمولة بين 0 و100.";return;}
      const gross=a*r, net=gross*(1-fee/100);
      out.textContent="المبلغ قبل العمولة: "+fmt(gross)+" — بعد العمولة: "+fmt(net)+" — سعر الوحدة الفعلي: "+fmt(a>0?net/a:0);
    }
    function assistant() {
      const box=$("sc-ask"), out=$("sc-assistant-result"), openp=$("sc-assistant-open"); if(!box||!out)return;
      const raw=box.value.trim(); if(!raw){out.textContent="اكتب سؤالك أولاً.";return;}
      const ar="٠١٢٣٤٥٦٧٨٩", txt=raw.replace(/[٠-٩]/g,d=>ar.indexOf(d)).replace(/(\d)[,٬،](\d{3})/g,"$1$2").replace(/٫/g,".");
      const nums=(txt.match(/\d+(?:\.\d+)?/g)||[]).map(Number);
      const pct=(txt.match(/(\d+(?:\.\d+)?)\s*(?:%|٪|في المئة|بالمئة|بالمائة|في المائة)/)||[])[1];
      const has=(...w)=>w.some(x=>txt.indexOf(x)>-1);
      const set=(map)=>{Object.keys(map).forEach(id=>{const el=$(id); if(el){el.value=map[id]; el.dispatchEvent(new Event("input",{bubbles:true})); el.dispatchEvent(new Event("change",{bubbles:true}));}});};
      let tab=null, label="", ok=false;
      const rest=(skip)=>nums.filter(n=>n!==Number(skip));
      if(has("قرض","تمويل")&&nums.length>=2){
        const rate=pct!=null?Number(pct):nums[1]; let months=NaN;
        const others=pct!=null?rest(pct):nums.slice(2);
        if(has("سنتين")) months=24; else if(others.length>=2||(pct==null&&nums.length>=3)){ const m=nums[nums.length-1]; months=has("سنة","سنوات","عام")?m*12:m; } else if(has("سنة","عام")) months=12;
        if(Number.isFinite(months)){ set({"sc-loan-amount":nums[0],"sc-loan-rate":rate,"sc-loan-months":months}); tab="loan"; label="حاسبة القرض"; ok=true; }
      } else if(has("ضريبة","القيمة المضافة")&&nums.length>=2){
        const rate=pct!=null?Number(pct):Math.min(...nums), amt=pct!=null?rest(pct)[0]:Math.max(...nums);
        set({"sc-vat-amount":amt,"sc-vat-rate":rate}); tab="vat"; label="حاسبة الضريبة"; ok=true;
      } else if(has("خصم","تخفيض","تنزيلات")&&nums.length>=2){
        const rate=pct!=null?Number(pct):Math.min(...nums), price=pct!=null?rest(pct)[0]:Math.max(...nums);
        set({"sc-price":price,"sc-rate":rate}); tab="discount"; label="حاسبة الخصم"; ok=true;
      } else if(has("هامش","ربح","الربح")&&nums.length>=2){
        set({"sc-margin-cost":Math.min(nums[0],nums[1]),"sc-margin-price":Math.max(nums[0],nums[1])}); tab="margin"; label="حاسبة هامش الربح"; ok=true;
      } else if(has("ادخار","أدخر","ادخر","هدف")&&nums.length>=2){
        const target=Math.max(...nums), monthly=Math.min(...nums); set({"sc-target":target,"sc-saved":0,"sc-monthly":monthly}); tab="saving"; label="هدف الادخار"; ok=true;
      } else if(has("أشخاص","اشخاص","فرد","قسمة","نقسم","فاتورة")&&nums.length>=2){
        const people=Math.min(...nums.filter(n=>Number.isInteger(n)&&n<=50&&n!==pct)), total=Math.max(...nums); set({"sc-split-total":total,"sc-split-tip":pct!=null?pct:0,"sc-split-people":people}); tab="split"; label="قسمة الفاتورة"; ok=true;
      } else if(has("ميزانية","دخل","راتب")&&nums.length>=2){
        set({"sc-income":Math.max(...nums),"sc-expenses":Math.min(...nums)}); tab="budget"; label="الميزانية الشهرية"; ok=true;
      } else if(has("نسبة","زيادة","ارتفع","ارتفاع","تغير")&&nums.length>=2){
        set({"sc-base":nums[0],"sc-new":nums[1]}); tab="percent"; label="النسبة المئوية والتغير"; ok=true;
      }
      if(!ok){out.textContent="لم أفهم السؤال بعد. اذكر نوع الحساب والأرقام، مثل: «خصم 20% على 2000»، «ضريبة 14% على 5000»، «قرض 100000 بفائدة 12% لمدة 24 شهر»، «تكلفة 80 وسعر البيع 100 كم الهامش»، «نسبة من 200 إلى 250».";if(openp)openp.textContent="";return;}
      const sec=$("sc-"+tab), res=sec&&sec.querySelector(".sc-tool-result");
      const k=res?Array.from(res.querySelectorAll(".kpi")).map(x=>{const sp=x.querySelector("span"),bb=x.querySelector("b,strong");return (sp?sp.textContent:"")+": "+(bb?bb.textContent:"");}):[];
      out.textContent=(k.length?k.join(" — "):(res?res.innerText.replace(/\n+/g," — "):""))+"  (الأداة: "+label+")";
      if(openp){openp.textContent="";const b=document.createElement("button");b.type="button";b.className="sc-ghost";b.textContent="افتح "+label+" لتعديل الأرقام";b.addEventListener("click",()=>showTab(tab));openp.appendChild(b);}
    }
    root.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click",()=>{const a=$("sc-ask"); if(a){a.value=b.getAttribute("data-q"); assistant();}}));
    const askGo=$("sc-ask-go"); if(askGo) askGo.addEventListener("click",assistant);
    const askBox=$("sc-ask"); if(askBox) askBox.addEventListener("keydown",e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();assistant();} });
    function decorate(out) {
      if (out.dataset.static || out.children.length) return;
      const text = out.textContent.trim(); if (!text) return;
      const parts = text.split(" — ").map(x => x.trim()).filter(Boolean);
      const re = /^([^:]{1,40}):\s*(.+)$/;
      if (!parts.some(x => re.test(x))) { out.classList.remove("sc-kpis"); out.classList.add("is-note"); return; }
      out.classList.add("sc-kpis"); out.classList.remove("is-note"); out.textContent = "";
      parts.forEach(x => {
        const m = re.exec(x), d = document.createElement("div");
        if (m) { d.className = "kpi"; const a = document.createElement("span"); a.textContent = m[1]; const b = document.createElement("b"); b.textContent = m[2]; d.appendChild(a); d.appendChild(b); }
        else { d.className = "kpi note"; d.textContent = x; }
        out.appendChild(d);
      });
    }
    function decorateAll() { root.querySelectorAll(".sc-tool-result").forEach(decorate); }
    const EXAMPLES = {
      "sc-discount": {"sc-price":2000,"sc-rate":20}, "sc-budget": {"sc-income":10000,"sc-expenses":6500},
      "sc-unit": {"sc-p1":45,"sc-q1":500,"sc-p2":80,"sc-q2":1000}, "sc-percent": {"sc-base":200,"sc-new":250},
      "sc-saving": {"sc-target":30000,"sc-saved":6000,"sc-monthly":2000}, "sc-total": {"sc-item":1200,"sc-shipping":60,"sc-fees":40},
      "sc-installment": {"sc-cash":20000,"sc-down":0,"sc-months":12,"sc-monthpay":1750}, "sc-convert": {"sc-convert-value":2.5},
      "sc-dates": {"sc-date1":"2026-01-01","sc-date2":"2026-12-31"}, "sc-vat": {"sc-vat-amount":1000,"sc-vat-rate":14},
      "sc-compare": {"sc-c-p1":10000,"sc-c-e1":500,"sc-c-l1":36,"sc-c-w1":24,"sc-c-p2":8000,"sc-c-e2":300,"sc-c-l2":24,"sc-c-w2":12},
      "sc-decide": {"sc-d-w0":5,"sc-d-s0-0":8,"sc-d-s0-1":6,"sc-d-s0-2":9,"sc-d-s1-0":7,"sc-d-s1-1":9,"sc-d-s1-2":5,"sc-d-s2-0":6,"sc-d-s2-1":8,"sc-d-s2-2":6,"sc-d-s3-0":7,"sc-d-s3-1":8,"sc-d-s3-2":4},
      "sc-loan": {"sc-loan-amount":100000,"sc-loan-rate":12,"sc-loan-months":24}, "sc-margin": {"sc-margin-cost":80,"sc-margin-price":100},
      "sc-split": {"sc-split-total":900,"sc-split-tip":10,"sc-split-people":3},
      "sc-compound": {"sc-cp-start":10000,"sc-cp-add":1000,"sc-cp-rate":8,"sc-cp-years":5}, "sc-breakeven": {"sc-be-fixed":6000,"sc-be-price":100,"sc-be-var":40},
      "sc-hourly": {"sc-hr-income":9000,"sc-hr-hours":8,"sc-hr-days":5,"sc-hr-price":3000}, "sc-trip": {"sc-trip-km":250,"sc-trip-cons":8,"sc-trip-price":10,"sc-trip-people":3}, "sc-fx": {"sc-fx-amount":500,"sc-fx-rate":48,"sc-fx-fee":1.5}
    };
    function fire(el) { el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); }
    root.querySelectorAll(".sc-tool").forEach(section => {
      if (section.querySelector(".sc-actions")) return;
      const ex = EXAMPLES[section.id]; if (!ex) return;
      const box = document.createElement("div"); box.className = "sc-actions";
      const b1 = document.createElement("button"); b1.type = "button"; b1.className = "sc-ghost"; b1.textContent = "جرّب مثالاً (أرقام افتراضية)";
      const b2 = document.createElement("button"); b2.type = "button"; b2.className = "sc-ghost"; b2.textContent = "مسح";
      b1.addEventListener("click", () => { Object.keys(ex).forEach(id => { const el = section.querySelector("#" + id); if (el) { el.value = ex[id]; fire(el); } }); });
      b2.addEventListener("click", () => { section.querySelectorAll("input").forEach(el => { if (el.id !== "sc-split-people" && el.type !== "text") { el.value = ""; } fire(el); }); });
      const b3 = document.createElement("button"); b3.type = "button"; b3.className = "sc-ghost"; b3.textContent = "نسخ النتيجة";
      b3.addEventListener("click", () => {
        const r = section.querySelector(".sc-tool-result"); const txt = r ? r.innerText.replace(/\n+/g, " — ").trim() : "";
        const done = () => { b3.textContent = "تم النسخ ✓"; setTimeout(() => { b3.textContent = "نسخ النتيجة"; }, 1800); };
        if (navigator.clipboard && txt) navigator.clipboard.writeText(txt).then(done).catch(() => {});
      });
      box.appendChild(b1); box.appendChild(b2); box.appendChild(b3);
      const res = section.querySelector(".sc-tool-result"); if (res) section.insertBefore(box, res); else section.appendChild(box);
    });
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
      "sc-loan-amount": loan, "sc-loan-rate": loan, "sc-loan-months": loan,
      "sc-margin-cost": margin, "sc-margin-price": margin,
      "sc-split-total": split, "sc-split-tip": split, "sc-split-people": split,
      "sc-cp-start": compound, "sc-cp-add": compound, "sc-cp-rate": compound, "sc-cp-years": compound,
      "sc-be-fixed": breakeven, "sc-be-price": breakeven, "sc-be-var": breakeven,
      "sc-hr-income": hourly, "sc-hr-hours": hourly, "sc-hr-days": hourly, "sc-hr-price": hourly,
      "sc-trip-km": trip, "sc-trip-cons": trip, "sc-trip-price": trip, "sc-trip-people": trip, "sc-trip-way": trip,
      "sc-fx-amount": fx, "sc-fx-rate": fx, "sc-fx-fee": fx,
      "sc-c-p1": compare, "sc-c-e1": compare, "sc-c-l1": compare, "sc-c-w1": compare, "sc-c-p2": compare, "sc-c-e2": compare, "sc-c-l2": compare, "sc-c-w2": compare
    };
    Object.keys(handlers).forEach(id => {
      const el=$(id);
      if (el) el.addEventListener("input", () => { handlers[id](); decorateAll(); });
    });
    root.querySelectorAll(".sc-tool").forEach(section => {
      const ex = EXAMPLES[section.id]; if (!ex) return;
      const inputs = Array.from(section.querySelectorAll("input")).filter(el => el.type !== "button");
      if (inputs.some(el => el.value !== "" && el.id !== "sc-split-people")) return;
      Object.keys(ex).forEach(id => { const el = section.querySelector("#" + id); if (el) { el.value = ex[id]; fire(el); } });
      const note = document.createElement("p"); note.className = "sc-demo-note"; note.textContent = "الأرقام الظاهرة أمثلة افتراضية للتوضيح — غيّرها بأرقامك أو اضغط «مسح».";
      const acts = section.querySelector(".sc-actions"); if (acts) section.insertBefore(note, acts);
    });
    const vatMode=$("sc-vat-mode"); if(vatMode) vatMode.addEventListener("change", () => { vat(); decorateAll(); });
    const decideBox=$("sc-decide"); if(decideBox) decideBox.addEventListener("input", decide);
    const convertType=$("sc-convert-type");
    if(convertType) convertType.addEventListener("change", () => { convert(); decorateAll(); });
    function showTab(tab) {
      const btn=root.querySelector('[data-tab="'+tab+'"]'); if(!btn) return;
      root.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-selected", String(b===btn)));
      root.querySelectorAll(".sc-tool").forEach(section => { section.hidden = section.id !== "sc-" + tab; });
    }
    root.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
      const tab=btn.getAttribute("data-tab"); showTab(tab);
      try { history.replaceState(null, "", "#" + tab); } catch (e) {}
    }));
    discount(); budget(); unit(); percent(); saving(); total(); installment(); convert(); dates(); vat(); compare(); decide(); loan(); margin(); split(); compound(); breakeven(); hourly(); trip(); fx(); decorateAll();
    const fromHash=(location.hash||"").replace("#",""); if(fromHash) showTab(fromHash);
  }
  function start() {
    document.querySelectorAll(".sc-page").forEach(init);
  }
  window.__scInitTools = start;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
/* Smart Choice — dynamic navigation, footer links and latest posts.
   Read from the blog's public feeds so new pages/posts appear without re-uploading the Blogger theme.
   Static markup in the theme remains as a fallback if a request fails. */
(function () {
  "use strict";
  var ORDER = ["الأدوات", "مقارنة", "مركز القرار", "من نحن", "سياسة المحتوى", "اتصل بنا", "سياسة الخصوصية", "الشروط", "لوحة الإدارة"];
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
  function markCurrent() {
    document.querySelectorAll(".sc-nav a").forEach(function (x) {
      try { var u = new URL(x.href); if (u.pathname === location.pathname) x.setAttribute("aria-current", "page"); } catch (e) {}
    });
  }
  function fillNav(list) {
    var nav = document.querySelector(".sc-nav");
    if (nav && list.length) {
      var home = nav.querySelector("a");
      nav.textContent = "";
      if (home) nav.appendChild(home);
      list.forEach(function (p) { nav.appendChild(link(p.url, p.title)); });
      markCurrent();
    }
    var foot = document.querySelector(".sc-footlinks");
    if (foot && list.length) {
      foot.textContent = "";
      list.forEach(function (p) { foot.appendChild(link(p.url, p.title)); });
    }
  }
  function fillLatest() {
    var box = document.querySelector(".sc-home-root .sc-latest-posts") || document.querySelector(".sc-latest-posts");
    if (!box) return;
    getJson("/feeds/posts/default?alt=json&max-results=6").then(function (d) {
      var items = ((d.feed && d.feed.entry) || []).filter(function (e) { return !/utilityra/i.test((e.title && e.title.$t) || ""); });
      if (!items.length) return;
      box.textContent = "";
      items.slice(0, 6).forEach(function (e) {
        var url = entryUrl(e); if (!url) return;
        var card = document.createElement("article"); card.className = "sc-card sc-post-card";
        var cats = (e.category || []).map(function (c) { return c.term; }).filter(Boolean);
        if (cats[0]) { var chip = document.createElement("span"); chip.className = "chip"; chip.textContent = cats[0]; card.appendChild(chip); }
        var h = document.createElement("h3"); h.appendChild(link(url, e.title.$t));
        var p = document.createElement("p");
        var text = (e.summary && e.summary.$t) || String((e.content && e.content.$t) || "").replace(/<[^>]*>/g, " ");
        p.textContent = text.replace(/\s+/g, " ").trim().slice(0, 130) + "…";
        var more = link(url, "اقرأ المقال ←"); more.className = "more";
        card.appendChild(h); card.appendChild(p); card.appendChild(more); box.appendChild(card);
      });
    }).catch(function () {});
  }
  window.__scFillLatest = fillLatest;
  window.__scPages = pages;
  function start() {
    pages().then(fillNav).catch(function () {});
    fillLatest();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

/* Smart Choice — self-healing content renderer.
   If the installed Blogger theme does not print a page/post body (empty content area), render it from the
   content bundle that GitHub generates from pages/ and posts/ (fallback: the blog's public feed), then start
   the tools. Does nothing when the theme already rendered the body. */
(function () {
  "use strict";
  var BUNDLES = [
    "https://raw.githubusercontent.com/tahattaha41/Smart-Choice/main/assets/content/bundle.json",
    "https://cdn.jsdelivr.net/gh/tahattaha41/Smart-Choice@main/assets/content/bundle.json"
  ];
  function has() { return document.querySelector(".post-body, .entry-content, .sc-page"); }
  function norm(t) { return String(t || "").replace(/\s+/g, " ").trim(); }
  function getJson(url) { return fetch(url, { credentials: "omit" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function firstOk(urls) { return urls.reduce(function (p, u) { return p.catch(function () { return getJson(u); }); }, Promise.reject()); }
  function render(title, html) {
    if (has()) return;
    var host = document.getElementById("main-content") || document.querySelector("main") || document.body;
    var art = document.createElement("article");
    art.className = "sc-post sc-injected";
    var h = document.createElement("h1");
    h.className = "post-title entry-title";
    h.textContent = String(title || "").replace(/\s*\|\s*Smart Choice\s*$/i, "");
    var body = document.createElement("div");
    body.className = "post-body entry-content";
    body.innerHTML = html; // محتوى المالك نفسه من مستودعه أو من خلاصة مدونته
    art.appendChild(h); art.appendChild(body);
    host.appendChild(art);
    if (window.__scInitTools) window.__scInitTools();
    if (window.__scInitAdmin) window.__scInitAdmin();
  }
  function run() {
    var path = location.pathname;
    var isPage = /^\/p\//.test(path), isPost = /^\/\d{4}\/\d{2}\//.test(path);
    if (!isPage && !isPost) return;
    if (has()) return;
    var feed = isPage ? "/feeds/pages/default?alt=json&max-results=150" : "/feeds/posts/default?alt=json&max-results=500";
    getJson(feed).then(function (d) {
      var hit = ((d.feed && d.feed.entry) || []).filter(function (e) {
        return (e.link || []).some(function (l) { if (l.rel !== "alternate") return false; try { return new URL(l.href).pathname === path; } catch (x) { return false; } });
      })[0];
      if (!hit) return;
      var title = hit.title && hit.title.$t;
      return firstOk(BUNDLES).then(function (b) {
        var m = (b.items || []).filter(function (i) { return norm(i.title) === norm(title); })[0];
        if (m) { render(title, m.html); return; }
        if (hit.content) render(title, hit.content.$t);
      }).catch(function () { if (hit.content) render(title, hit.content.$t); });
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();

/* Smart Choice — home page. Built here (not in the Blogger theme) so the design can be changed from GitHub
   without re-uploading the theme. The theme's own static home block stays as a no-JS fallback. */
(function () {
  "use strict";
  var isHome = location.pathname.replace(/index\.html$/, "") === "/";
  if (isHome) document.documentElement.classList.add("sc-home");
  var TOOLS = [
    ["🏷️", "حاسبة الخصم", "السعر بعد الخصم وقيمة التوفير الحقيقية.", "discount"],
    ["🆚", "مقارنة المنتجات", "التكلفة الشهرية الحقيقية مع الضمان وعمر الاستخدام.", "compare"],
    ["🧭", "مركز القرار", "رتّب خياراتك بمعايير وأوزان تحددها أنت.", "decide"],
    ["💳", "التقسيط", "كم تدفع زيادة عن السعر النقدي فعلاً؟", "installment"],
    ["🏦", "القرض", "القسط الشهري وإجمالي الفوائد.", "loan"],
    ["💰", "الميزانية الشهرية", "المتبقي ونسبة الإنفاق من دخلك.", "budget"],
    ["⚖️", "سعر الوحدة", "أي عبوة أوفر لكل جرام أو لتر؟", "unit"],
    ["🤖", "المساعد الذكي", "اكتب سؤالك بأرقامك واحصل على الحساب فوراً.", "assistant"]
  ];
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function run() {
    if (!isHome) return;
    var host = document.getElementById("main-content") || document.querySelector("main");
    if (!host || host.querySelector(".sc-home-root") || !window.__scPages) return;
    window.__scPages().then(function (list) {
      if (host.querySelector(".sc-home-root")) return;
      var by = function (k) { var m = list.filter(function (p) { return p.title.indexOf(k) === 0; })[0]; return m ? m.url : "#"; };
      var tools = by("الأدوات");
      var html = "<div class='sc-home-root'>" +
        "<section class='sc-hero2'><div class='sc-hero2-text'>" +
        "<span class='sc-badge'>مجاني • بدون تسجيل • بياناتك تبقى في متصفحك</span>" +
        "<h1>اتخذ قرار الشراء <span>بالأرقام</span> لا بالانطباع</h1>" +
        "<p>أدوات حساب ومقارنة واضحة: الخصم، التقسيط، القرض، الضريبة، الميزانية، وتكلفة امتلاك المنتج على المدى الطويل.</p>" +
        "<div class='sc-hero2-cta'><a class='sc-btn' href='" + tools + "'>ابدأ بالأدوات</a><a class='sc-btn alt' href='/search'>اقرأ الأدلة</a></div></div>" +
        "<div class='sc-hero2-art' aria-hidden='true'><div class='sc-demo'><small>مثال توضيحي (أرقام افتراضية)</small><div class='row'><span>السعر الأصلي</span><b>2,000</b></div><div class='row'><span>الخصم</span><b>20%</b></div><div class='bar'><i></i></div><div class='row big'><span>تدفع</span><b>1,600</b></div><div class='row save'><span>توفير</span><b>400</b></div></div><span class='orb o1'></span><span class='orb o2'></span></div></section>" +
        "<section class='sc-sec'><h2 class='sc-h2'>أدواتنا الأكثر استخداماً</h2><p class='sc-sub'>اختر الأداة، جرّب مثالاً جاهزاً أو أدخل أرقامك.</p><div class='sc-toolgrid'>" +
        TOOLS.map(function (t) { return "<a class='sc-tool-tile' href='" + tools + "#" + t[3] + "'><span class='ico'>" + t[0] + "</span><b>" + esc(t[1]) + "</b><small>" + esc(t[2]) + "</small></a>"; }).join("") +
        "</div><p class='sc-more'><a href='" + tools + "'>عرض كل الأدوات (21 أداة) ←</a></p></section>" +
        "<section class='sc-sec sc-steps'><h2 class='sc-h2'>كيف تستفيد؟</h2><div class='sc-stepgrid'>" +
        "<div><span>1</span><b>أدخل أرقامك</b><small>السعر، الخصم، الضمان، الدخل… ما تعرفه أنت.</small></div>" +
        "<div><span>2</span><b>شاهد النتيجة فوراً</b><small>تُحسب داخل متصفحك بمعادلات معروفة.</small></div>" +
        "<div><span>3</span><b>قارن وقرر</b><small>استخدم مركز القرار لترتيب خياراتك بأوزانك.</small></div></div></section>" +
        "<section class='sc-sec'><h2 class='sc-h2'>أحدث الأدلة والمقالات</h2><p class='sc-sub'>شروحات عملية بأمثلة رقمية مبسطة.</p><div class='sc-cards sc-latest-posts'></div><p class='sc-more'><a href='/search'>كل المقالات ←</a></p></section>" +
        "<section class='sc-sec sc-trust'><div><b>🔒 خصوصيتك أولاً</b><small>لا نطلب تسجيلاً ولا نرسل مدخلاتك إلى أي جهة.</small></div><div><b>🧾 بلا أرقام مختلقة</b><small>لا نعرض أسعاراً أو تقييمات لا نملك مصدرها.</small></div><div><b>✍️ محتوى نكتبه بأنفسنا</b><small>اطّلع على <a href='" + by("سياسة المحتوى") + "'>سياسة المحتوى والتحرير</a>.</small></div></section></div>";
      var wrap = document.createElement("div"); wrap.innerHTML = html; host.appendChild(wrap.firstChild);
      document.documentElement.classList.add("sc-home-ready");
      if (window.__scFillLatest) window.__scFillLatest();
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();

/* Smart Choice — admin status board (read-only). Shows only public, non-secret information:
   the latest automated live-site test, the Blogger inventory report, configured tracking IDs and quick links.
   It never shows invented analytics or earnings numbers. */
(function () {
  "use strict";
  var RAW = "https://raw.githubusercontent.com/tahattaha41/Smart-Choice/main/";
  var REPO = "https://github.com/tahattaha41/Smart-Choice";
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function card(title) { var c = el("section", "sc-tool-card"); c.appendChild(el("h2", null, title)); return c; }
  function a(href, text) { var x = el("a", null, text); x.href = href; x.target = "_blank"; x.rel = "noopener"; return x; }
  function get(path, json) {
    return fetch(RAW + path + "?t=" + Math.floor(Date.now() / 300000), { credentials: "omit" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return json ? r.json() : r.text(); });
  }
  function row(table, cells) { var tr = el("tr"); cells.forEach(function (c) { var td = el("td"); if (c && c.nodeType) td.appendChild(c); else td.textContent = c; tr.appendChild(td); }); table.appendChild(tr); }
  function tableOf(head) { var t = el("table", "sc-admin-table"); var h = el("tr"); head.forEach(function (x) { h.appendChild(el("th", null, x)); }); t.appendChild(h); return t; }
  function wrap(t) { var d = el("div", "sc-tbl"); d.appendChild(t); return d; }

  var KP = {};
  function kpi(label, value, cls) { var k = el("div", "kpi" + (cls ? " " + cls : "")); k.appendChild(el("span", null, label)); k.appendChild(el("b", null, value)); return k; }
  function auditCard(root) {
    var c = card("جاهزية AdSense (فحص آلي)"); root.appendChild(c);
    get("reports/adsense-audit.json", true).then(function (d) {
      if (KP.set) KP.set("adsense", "جاهزية AdSense", d.score + "%", d.score < 80 ? "" : "");
      c.appendChild(el("p", d.score >= 85 ? "sc-good" : "sc-bad", "النتيجة: " + d.score + "% — مقالات: " + d.posts + " — متوسط الكلمات: " + d.avg_words));
      var t = tableOf(["الحالة", "الفحص", "التفاصيل / الحل"]);
      d.checks.filter(function (x) { return x.level !== "info"; }).forEach(function (x) {
        row(t, [el("span", x.level === "pass" ? "sc-good" : "sc-bad", x.level === "pass" ? "✓" : (x.level === "warn" ? "⚠" : "✗")), x.title, (x.detail || "") + (x.level !== "pass" && x.fix ? " — الحل: " + x.fix : "")]);
      });
      c.appendChild(wrap(t));
      c.appendChild(el("p", "sc-muted", "الفحص لا يضمن القبول؛ القرار النهائي لجوجل. أمور يدوية: " + d.manual.join(" ")));
    }).catch(function () { c.appendChild(el("p", "sc-muted", "لم يُنشأ تقرير الفحص بعد؛ يعمل تلقائياً عند أي تعديل وأسبوعياً.")); });
  }
  function aiCard(root) {
    var c = card("مراجعة الذكاء الاصطناعي"); root.appendChild(c);
    get("reports/ai-review.md", false).then(function (txt) {
      var pre = el("div", "sc-ai-text", txt.trim()); c.appendChild(pre);
    }).catch(function () { c.appendChild(el("p", "sc-muted", "لا توجد مراجعة بعد؛ تعمل تلقائياً أسبوعياً وعند تعديل المحتوى.")); });
  }
  function overview(root) {
    var c = el("section", "sc-tool-card"); c.appendChild(el("h2", null, "نظرة عامة")); var g = el("div", "sc-kpis"); c.appendChild(g); root.appendChild(c);
    KP.set = function (id, label, value, cls) { var old = g.querySelector("[data-k='" + id + "']"); var k = kpi(label, value, cls); k.setAttribute("data-k", id); if (old) g.replaceChild(k, old); else g.appendChild(k); };
    KP.set("checks", "الفحص الآلي", "جارٍ التحميل…"); KP.set("pages", "الصفحات", "…"); KP.set("posts", "المقالات", "…");
  }
  function todoCard(root) {
    var c = card("خطوات يقوم بها المالك (لا يمكن أتمتتها)"); root.appendChild(c);
    var ul = el("ul");
    ["طلب مراجعة الموقع في Google AdSense بعد اكتمال المحتوى.", "إضافة سطر ads.txt من إعدادات بلوجر (الصيغة في docs/ADSENSE_READINESS.md).", "تسجيل الموقع في Google Search Console وإرسال sitemap.xml.", "تنظيف حسابات Utilityra القديمة في AdSense وAnalytics.", "إلغاء أي مفاتيح سرية سبق تسريبها وإنشاء بدائل."]
      .forEach(function (x) { ul.appendChild(el("li", null, x)); });
    c.appendChild(ul);
  }
  function statusCard(root) {
    var c = card("نتيجة آخر فحص آلي للموقع الحي"); root.appendChild(c);
    get("reports/live-e2e.txt", false).then(function (txt) {
      var lines = txt.split("\n").filter(function (l) { return /^(OK|FAIL) /.test(l); });
      var fail = lines.filter(function (l) { return l.indexOf("FAIL") === 0; });
      c.appendChild(el("p", fail.length ? "sc-bad" : "sc-good", fail.length ? ("يوجد " + fail.length + " فحص فاشل من " + lines.length) : ("كل الفحوصات ناجحة (" + lines.length + ")")));
      if (KP.set) KP.set("checks", "الفحص الآلي", (lines.length - fail.length) + " / " + lines.length, "");
      var t = tableOf(["الحالة", "الفحص"]);
      lines.forEach(function (l) { row(t, [el("span", l.indexOf("OK") === 0 ? "sc-good" : "sc-bad", l.indexOf("OK") === 0 ? "✓ ناجح" : "✗ فاشل"), l.replace(/^(OK|FAIL)\s+/, "")]); });
      c.appendChild(wrap(t));
      c.appendChild(el("p", "sc-muted", "الفحص يعمل تلقائياً كل يوم وعند أي تعديل على المحتوى."));
    }).catch(function () { c.appendChild(el("p", "sc-muted", "تعذر تحميل تقرير الفحص الآن.")); });
  }
  function inventoryCard(root) {
    var c = card("محتوى المدونة"); root.appendChild(c);
    function feed(kind) { return fetch("/feeds/" + kind + "/default?alt=json&max-results=150", { credentials: "omit" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) { return ((j.feed && j.feed.entry) || []).map(function (e) { var l = (e.link || []).filter(function (x) { return x.rel === "alternate"; })[0]; return { title: e.title.$t, url: l ? l.href : "" }; }); }); }
    Promise.all([feed("pages"), feed("posts")]).then(function (r) {
      var d = { pages: r[0], posts: r[1] };
      if (KP.set) { KP.set("pages", "الصفحات", String(d.pages.length)); KP.set("posts", "المقالات", String(d.posts.length)); }
      c.appendChild(el("p", null, "الصفحات: " + d.pages.length + " — المقالات: " + d.posts.length + " (من خلاصة المدونة الحية)"));
      var t = tableOf(["النوع", "العنوان", "الحالة"]);
      d.pages.forEach(function (x) { var cell = el("span"); cell.appendChild(a(x.url, x.title)); row(t, ["صفحة", cell, "منشورة"]); });
      d.posts.forEach(function (x) { var cell = el("span"); cell.appendChild(a(x.url, x.title)); row(t, ["مقال", cell, "منشور"]); });
      c.appendChild(wrap(t));
    }).catch(function () { c.appendChild(el("p", "sc-muted", "تعذر تحميل تقرير المحتوى الآن.")); });
  }
  function connectionsCard(root) {
    var c = card("الربط والإحصائيات والإعلانات"); root.appendChild(c);
    var t = tableOf(["الخدمة", "المعرّف", "الحالة المسجلة"]);
    row(t, ["Google Analytics 4", "G-BRZP957SQ4", "الكود مثبت في القالب. لم يُتحقق بعد من وصول البيانات إلى الحساب."]);
    row(t, ["Google AdSense", "ca-pub-1235197294708204", "كود التحميل مثبت في القالب. القبول يتم من جوجل ولا يُعتبر مضموناً."]);
    row(t, ["Google Tag Manager", "GTM-WGSK7LQC", "مسجل في مرجع المشروع فقط، وغير مثبت في القالب لتجنب تكرار القياس."]);
    c.appendChild(wrap(t));
    c.appendChild(el("p", "sc-muted", "لا تُعرض هنا أرقام زيارات أو أرباح لأنها تتطلب ربطاً آمناً بحساب Google من خادم، ولن نعرض أرقاماً تجريبية. تابع الأرقام الحقيقية من لوحتَي Analytics وAdSense."));
  }
  function linksCard(root) {
    var c = card("روابط الإدارة السريعة"); root.appendChild(c);
    var ul = el("ul");
    [["المستودع على GitHub", REPO], ["تعديل الصفحات والأدوات", REPO + "/tree/main/pages"], ["إضافة/تعديل المقالات", REPO + "/tree/main/posts"],
     ["سجل العمليات (Actions)", REPO + "/actions"], ["لوحة Blogger", "https://www.blogger.com"], ["Google Analytics", "https://analytics.google.com"],
     ["Google AdSense", "https://adsense.google.com"], ["Google Search Console", "https://search.google.com/search-console"]
    ].forEach(function (x) { var li = el("li"); li.appendChild(a(x[1], x[0])); ul.appendChild(li); });
    c.appendChild(ul);
    c.appendChild(el("p", "sc-muted", "التعديل يتم من GitHub، ثم تصل التغييرات إلى المدونة تلقائياً."));
  }
  /* بوابة كلمة السر: تحجب اللوحة عن الزوار العاديين. ملاحظة أمنية: هذه حماية واجهة فقط (لا يوجد خادم)،
     ولذلك لا تعرض اللوحة أي سر؛ الكتابة الفعلية تتم عبر تسجيل دخول GitHub. */
  var SALT = "smart-choice-admin-v1", HASH = "c8601e15655da80fa3388e066a0c6aa4b63d6cc287d3183b454efa82e9be1d5c", ITER = 150000;
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function check(pw) {
    var enc = new TextEncoder();
    return Promise.resolve().then(function () { return crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]); }).then(function (k) {
      return crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(SALT), iterations: ITER, hash: "SHA-256" }, k, 256);
    }).then(function (bits) { return hex(bits) === HASH; });
  }
  function unlocked() { try { return sessionStorage.getItem("sc-admin") === HASH; } catch (e) { return false; } }
  function composerCard(root) {
    var c = card("كتابة مقال جديد"); root.appendChild(c);
    c.appendChild(el("p", "sc-muted", "اكتب المقال هنا ثم اضغط الزر: يفتح GitHub بملف جاهز، وبعد الحفظ (Commit) يُنشر تلقائياً على المدونة. الكتابة محمية بتسجيل دخولك إلى GitHub."));
    var f = el("div", "sc-tool-grid");
    function field(label, tag, ph) { var l = el("label", null, label); var i = el(tag); if (ph) i.placeholder = ph; if (tag === "textarea") i.rows = 9; l.appendChild(i); f.appendChild(l); return i; }
    var title = field("عنوان المقال", "input", "مثال: كيف تقارن بين عرضين");
    var labels = field("التصنيف (اختياري)", "input", "التسوق الذكي");
    var body = field("نص المقال (HTML بسيط: <p> و<h2>)", "textarea", "<p>…</p>");
    c.appendChild(f);
    var go = el("button", "sc-btn", "فتح GitHub لنشر المقال"); go.type = "button";
    go.addEventListener("click", function () {
      var t = title.value.trim(), b = body.value.trim();
      if (!t || !b) { alert("اكتب العنوان والنص أولاً."); return; }
      var slug = "post-" + new Date().toISOString().slice(0, 10) + "-" + Math.random().toString(36).slice(2, 6);
      var md = "---\ntitle: " + t + "\nlabels: " + (labels.value.trim() || "Smart Choice") + "\npublish: true\n---\n" + b + "\n";
      window.open(REPO + "/new/main/posts?filename=" + encodeURIComponent(slug + ".md") + "&value=" + encodeURIComponent(md), "_blank", "noopener");
    });
    c.appendChild(go);
  }
  function panels(root) {
    root.textContent = "";
    overview(root); composerCard(root); auditCard(root); aiCard(root); statusCard(root); inventoryCard(root); connectionsCard(root); todoCard(root); linksCard(root);
  }
  function run() {
    var root = document.getElementById("sc-admin-root");
    if (!root || root.dataset.scReady) return;
    root.dataset.scReady = "1";
    var m = document.createElement("meta"); m.name = "robots"; m.content = "noindex,nofollow"; document.head.appendChild(m);
    if (unlocked()) { panels(root); return; }
    root.textContent = "";
    var c = card("دخول الإدارة"); root.appendChild(c);
    c.appendChild(el("p", "sc-muted", "هذه الصفحة خاصة بمالك الموقع. أدخل كلمة السر للمتابعة."));
    var inp = el("input"); inp.type = "password"; inp.autocomplete = "current-password"; inp.placeholder = "كلمة السر"; inp.setAttribute("aria-label", "كلمة السر");
    var btn = el("button", "sc-btn", "دخول"); btn.type = "button"; var msg = el("p", "sc-bad", "");
    function submit() {
      check(inp.value).then(function (ok) {
        if (ok) { try { sessionStorage.setItem("sc-admin", HASH); } catch (e) {} panels(root); }
        else { msg.textContent = "كلمة السر غير صحيحة."; inp.value = ""; }
      }).catch(function () { msg.textContent = "المتصفح لا يدعم التحقق."; });
    }
    btn.addEventListener("click", submit); inp.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    c.appendChild(inp); c.appendChild(btn); c.appendChild(msg);
  }
  window.__scInitAdmin = run;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();


/* Smart Choice — ميزات عامة: بحث، العودة للأعلى، وتحسينات صفحات المقالات (وقت القراءة، مشاركة، مقالات ذات صلة، بيانات منظمة) */
(function () {
  "use strict";
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function addSearch() {
    var inner = document.querySelector(".sc-headin");
    if (!inner || inner.querySelector(".sc-search")) return;
    var f = el("form", "sc-search"); f.action = "/search"; f.method = "get"; f.setAttribute("role", "search");
    var i = el("input"); i.type = "search"; i.name = "q"; i.placeholder = "ابحث في المقالات…"; i.setAttribute("aria-label", "بحث");
    var b = el("button", null, "بحث"); b.type = "submit";
    f.appendChild(i); f.appendChild(b); inner.appendChild(f);
  }
  function addTop() {
    if (document.querySelector(".sc-totop")) return;
    var b = el("button", "sc-totop", "↑"); b.type = "button"; b.setAttribute("aria-label", "العودة للأعلى");
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(b);
    window.addEventListener("scroll", function () { b.classList.toggle("show", window.scrollY > 700); }, { passive: true });
  }
  function enhancePost(body) {
    if (body.dataset.scEnh) return; body.dataset.scEnh = "1";
    var titleEl = document.querySelector(".post-title, .entry-title, h1");
    var title = titleEl ? titleEl.textContent.trim() : document.title;
    var words = (body.innerText || "").trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 180));
    var meta = el("p", "sc-readtime", "⏱ وقت القراءة: " + mins + (mins === 1 ? " دقيقة" : " دقائق") + " · " + words + " كلمة");
    body.parentNode.insertBefore(meta, body);
    var url = location.href.split("?")[0].split("#")[0];
    var share = el("div", "sc-share"); share.appendChild(el("b", null, "شارك المقال: "));
    [["واتساب", "https://wa.me/?text=" + encodeURIComponent(title + " " + url)], ["فيسبوك", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)], ["إكس", "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title)]].forEach(function (x) {
      var a = el("a", null, x[0]); a.href = x[1]; a.target = "_blank"; a.rel = "noopener"; share.appendChild(a);
    });
    var cp = el("button", null, "نسخ الرابط"); cp.type = "button";
    cp.addEventListener("click", function () { if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { cp.textContent = "تم النسخ ✓"; }); });
    share.appendChild(cp); body.parentNode.insertBefore(share, body.nextSibling);
    // مقالات ذات صلة
    fetch("/feeds/posts/default?alt=json&max-results=50", { credentials: "omit" }).then(function (r) { return r.json(); }).then(function (d) {
      var all = ((d.feed && d.feed.entry) || []).map(function (e) {
        var l = (e.link || []).filter(function (x) { return x.rel === "alternate"; })[0];
        return { t: e.title.$t, u: l ? l.href : "", c: (e.category || []).map(function (c) { return c.term; }) };
      }).filter(function (x) { return x.u && x.u.split("?")[0] !== url && !/أهلاً بك/.test(x.t); });
      var mine = ((document.querySelector(".sc-post-labels") || {}).textContent) || "";
      all.sort(function (a, b) { return (b.c.some(function (c) { return mine.indexOf(c) > -1; }) ? 1 : 0) - (a.c.some(function (c) { return mine.indexOf(c) > -1; }) ? 1 : 0); });
      var rel = all.slice(0, 3); if (!rel.length) return;
      var box = el("section", "sc-related"); box.appendChild(el("h2", null, "قد يهمّك أيضاً"));
      var g = el("div", "sc-cards");
      rel.forEach(function (x) { var c = el("article", "sc-card"); var h = el("h3"); var a = el("a", null, x.t); a.href = x.u; h.appendChild(a); c.appendChild(h); g.appendChild(c); });
      box.appendChild(g); share.parentNode.insertBefore(box, share.nextSibling);
    }).catch(function () {});
    // بيانات منظمة Article
    try {
      var ld = el("script"); ld.type = "application/ld+json";
      ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", "headline": title, "inLanguage": "ar", "mainEntityOfPage": url, "publisher": { "@type": "Organization", "name": "Smart Choice" } });
      document.head.appendChild(ld);
    } catch (e) {}
  }
  function tryPost(n) {
    if (!/^\/\d{4}\/\d{2}\//.test(location.pathname)) return;
    var body = document.querySelector(".post-body, .entry-content");
    if (body && (body.innerText || "").trim().length > 200) { enhancePost(body); return; }
    if (n < 25) setTimeout(function () { tryPost(n + 1); }, 400);
  }
  function run() { addSearch(); addTop(); tryPost(0); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
