/* Smart Choice — استبعاد المالك والروبوتات من Google Analytics (علامة محلية على جهاز المالك) */
(function () {
  try {
    if (/[?&]owner=1/.test(location.search)) localStorage.setItem("sc-owner", "1");
    if (localStorage.getItem("sc-owner") === "1" || navigator.webdriver) window["ga-disable-G-BRZP957SQ4"] = true;
  } catch (e) { if (navigator.webdriver) window["ga-disable-G-BRZP957SQ4"] = true; }
})();

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
    function bmi() {
      const w=value("sc-bmi-w"), h=value("sc-bmi-h"), out=$("sc-bmi-result"); if(!out)return;
      if(![w,h].every(Number.isFinite)||w<=0||h<=0||h<50||h>250||w>500){out.textContent="أدخل وزناً (كجم) وطولاً (50–250 سم) صحيحين.";return;}
      const v=w/Math.pow(h/100,2); const cat=v<18.5?"نحافة":(v<25?"وزن طبيعي":(v<30?"زيادة وزن":"سمنة"));
      const lo=18.5*Math.pow(h/100,2), hi=24.9*Math.pow(h/100,2);
      out.textContent="مؤشر كتلة الجسم: "+fmt(v)+" — التصنيف: "+cat+" — الوزن الطبيعي لطولك: "+fmt(lo)+" إلى "+fmt(hi)+" كجم";
    }
    function age() {
      const bEl=$("sc-age-birth"), tEl=$("sc-age-to"), out=$("sc-age-result"); if(!out||!bEl)return;
      if(!bEl.value){out.textContent="أدخل تاريخ الميلاد.";return;}
      const b=new Date(bEl.value+"T00:00:00"), now=new Date(); const t=tEl&&tEl.value?new Date(tEl.value+"T00:00:00"):new Date(now.getFullYear(),now.getMonth(),now.getDate());
      if(isNaN(b)||t<b){out.textContent="تاريخ الميلاد يجب أن يسبق التاريخ المقارن.";return;}
      let y=t.getFullYear()-b.getFullYear(), m=t.getMonth()-b.getMonth(), d=t.getDate()-b.getDate();
      if(d<0){m--; d+=new Date(t.getFullYear(),t.getMonth(),0).getDate();} if(m<0){y--; m+=12;}
      const days=Math.floor((t-b)/86400000); let next=new Date(t.getFullYear(),b.getMonth(),b.getDate()); if(next<t) next=new Date(t.getFullYear()+1,b.getMonth(),b.getDate());
      out.textContent="العمر: "+y+" سنة و"+m+" شهراً و"+d+" يوماً — إجمالي الأيام: "+fmt(days)+" — يوم على عيد ميلادك القادم: "+fmt(Math.round((next-t)/86400000));
    }
    function zakat() {
      const g=(id)=>Number.isFinite(value(id))?value(id):0, nis=value("sc-z-nisab"), out=$("sc-zakat-result"); if(!out)return;
      if(!Number.isFinite(nis)||nis<=0){out.textContent="أدخل قيمة النصاب الحالية (أكبر من صفر).";return;}
      const gross=g("sc-z-cash")+g("sc-z-gold")+g("sc-z-trade"), debt=g("sc-z-debt"), net=Math.max(0,gross-debt);
      if(net<nis){out.textContent="صافي المال: "+fmt(net)+" — لم يبلغ النصاب ("+fmt(nis)+") — الزكاة المقدّرة: 0";return;}
      out.textContent="صافي المال: "+fmt(net)+" — بلغ النصاب — الزكاة المقدّرة (2.5%): "+fmt(net*0.025);
    }
    function grade() {
      const c=value("sc-g-cur"), w=value("sc-g-weight"), tg=value("sc-g-target"), out=$("sc-grade-result"); if(!out)return;
      if(![c,w,tg].every(Number.isFinite)||c<0||c>100||w<=0||w>100||tg<0||tg>100){out.textContent="أدخل نسباً بين 0 و100 (وزن الاختبار أكبر من صفر).";return;}
      const need=(tg-c*(1-w/100))/(w/100);
      out.textContent=need>100?"الدرجة المطلوبة في النهائي: "+fmt(need)+"% — أعلى من 100%، لا يمكن بلوغ الهدف":(need<=0?"الدرجة المطلوبة في النهائي: 0% — هدفك محقق مسبقاً":"الدرجة المطلوبة في النهائي: "+fmt(need)+"%");
    }
    const HJ=(d)=>{ const p=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"numeric",year:"numeric"}).formatToParts(d); const o={}; p.forEach(x=>{o[x.type]=parseInt(x.value,10);}); return o; };
    const HM=["محرم","صفر","ربيع الأول","ربيع الآخر","جمادى الأولى","جمادى الآخرة","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة"];
    function hijri(ev) {
      const out=$("sc-hijri-result"), gEl=$("sc-h-greg"), yEl=$("sc-h-y"), mEl=$("sc-h-m"), dEl=$("sc-h-d"); if(!out||!gEl)return;
      try {
        const src=ev&&ev.target?ev.target.id:"sc-h-greg";
        if(src==="sc-h-greg"&&gEl.value){ const d=new Date(gEl.value+"T12:00:00"); const h=HJ(d); out.textContent="التاريخ الهجري: "+h.day+" "+HM[h.month-1]+" "+h.year+"هـ"; return; }
        const y=value("sc-h-y"), m=value("sc-h-m"), dd=value("sc-h-d");
        if([y,m,dd].every(Number.isFinite)){
          const est=new Date(Date.UTC(622,6,16)+(y-1)*354.367*86400000+(m-1)*29.53*86400000+(dd-1)*86400000);
          for(let k=-45;k<=45;k++){ const c=new Date(est.getTime()+k*86400000+43200000); const h=HJ(c); if(h.year===y&&h.month===m&&h.day===dd){ out.textContent="التاريخ الميلادي: "+new Intl.DateTimeFormat("ar-EG",{day:"numeric",month:"long",year:"numeric",calendar:"gregory"}).format(c); return; } }
          out.textContent="تاريخ هجري غير صالح (تحقق من اليوم والشهر)."; return;
        }
        if(gEl.value){ const h=HJ(new Date(gEl.value+"T12:00:00")); out.textContent="التاريخ الهجري: "+h.day+" "+HM[h.month-1]+" "+h.year+"هـ"; } else out.textContent="اختر تاريخاً ميلادياً أو أدخل تاريخاً هجرياً كاملاً.";
      } catch(e){ out.textContent="متصفحك لا يدعم التقويم الهجري."; }
    }
    function wordcount() {
      const el=$("sc-wc-text"), out=$("sc-wordcount-result"); if(!el||!out)return; const t=el.value;
      if(!t.trim()){out.textContent="ابدأ بالكتابة.";return;}
      const words=(t.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)||[]).length, chars=t.length, nos=t.replace(/\s/g,"").length, sent=(t.match(/[^.!؟?\n]+[.!؟?]+|[^.!؟?\n]+$/g)||[]).filter(x=>x.trim()).length;
      const mins=Math.max(1,Math.round(words/180));
      out.textContent="الكلمات: "+fmt(words)+" — الحروف: "+fmt(chars)+" — بدون مسافات: "+fmt(nos)+" — الجمل: "+fmt(sent)+" — وقت القراءة: "+mins+" دقيقة";
    }
    function genPassword() {
      const out=$("sc-password-result"), st=$("sc-pw-strength"); if(!out)return;
      let n=Math.round(value("sc-pw-len")); if(!Number.isFinite(n)) n=16; n=Math.min(64,Math.max(8,n));
      const sets=[["sc-pw-up","ABCDEFGHJKLMNPQRSTUVWXYZ"],["sc-pw-lo","abcdefghijkmnpqrstuvwxyz"],["sc-pw-di","23456789"],["sc-pw-sy","!@#$%^&*-_=+?"]].filter(x=>$(x[0])&&$(x[0]).checked);
      if(!sets.length){out.textContent="اختر نوعاً واحداً على الأقل من المحارف.";return;}
      const pool=sets.map(x=>x[1]).join(""); const rnd=(max)=>{ const a=new Uint32Array(1), lim=Math.floor(4294967296/max)*max; do{ crypto.getRandomValues(a); }while(a[0]>=lim); return a[0]%max; };
      const chars=sets.map(x=>x[1][rnd(x[1].length)]); while(chars.length<n) chars.push(pool[rnd(pool.length)]);
      for(let i=chars.length-1;i>0;i--){ const j=rnd(i+1); [chars[i],chars[j]]=[chars[j],chars[i]]; }
      out.textContent=chars.join("");
      const bits=Math.round(n*Math.log2(pool.length)); if(st) st.textContent="القوة التقديرية: "+bits+" بت — "+(bits<60?"ضعيفة":(bits<80?"متوسطة":(bits<110?"قوية":"قوية جداً")));
    }
    const pwGo=$("sc-pw-go"); if(pwGo) pwGo.addEventListener("click",genPassword);
    const pwCopy=$("sc-pw-copy"); if(pwCopy) pwCopy.addEventListener("click",()=>{ const r=$("sc-password-result"); if(r&&navigator.clipboard&&r.textContent.length>=8) navigator.clipboard.writeText(r.textContent).then(()=>{pwCopy.textContent="تم النسخ ✓";setTimeout(()=>{pwCopy.textContent="نسخ";},1500);}); });
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
      "sc-hourly": {"sc-hr-income":9000,"sc-hr-hours":8,"sc-hr-days":5,"sc-hr-price":3000}, "sc-trip": {"sc-trip-km":250,"sc-trip-cons":8,"sc-trip-price":10,"sc-trip-people":3}, "sc-fx": {"sc-fx-amount":500,"sc-fx-rate":48,"sc-fx-fee":1.5},
      "sc-bmi": {"sc-bmi-w":78,"sc-bmi-h":175}, "sc-age": {"sc-age-birth":"1995-06-15"}, "sc-zakat": {"sc-z-cash":120000,"sc-z-gold":30000,"sc-z-trade":0,"sc-z-debt":10000,"sc-z-nisab":85000},
      "sc-grade": {"sc-g-cur":78,"sc-g-weight":40,"sc-g-target":85}, "sc-hijri": {"sc-h-greg":"2026-03-20"}, "sc-wordcount": {"sc-wc-text":"اكتب نصك هنا. هذا مثال بسيط لعدّ الكلمات والحروف والجمل في النص."}, "sc-password": {"sc-pw-len":16}
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
      "sc-bmi-w": bmi, "sc-bmi-h": bmi, "sc-age-birth": age, "sc-age-to": age,
      "sc-z-cash": zakat, "sc-z-gold": zakat, "sc-z-trade": zakat, "sc-z-debt": zakat, "sc-z-nisab": zakat,
      "sc-g-cur": grade, "sc-g-weight": grade, "sc-g-target": grade,
      "sc-h-greg": hijri, "sc-h-y": hijri, "sc-h-m": hijri, "sc-h-d": hijri, "sc-wc-text": wordcount,
      "sc-c-p1": compare, "sc-c-e1": compare, "sc-c-l1": compare, "sc-c-w1": compare, "sc-c-p2": compare, "sc-c-e2": compare, "sc-c-l2": compare, "sc-c-w2": compare
    };
    Object.keys(handlers).forEach(id => {
      const el=$(id);
      if (el) el.addEventListener("input", (ev) => { handlers[id](ev); decorateAll(); });
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
    /* تصنيفات وبحث الأدوات */
    const CATS = [["all","الكل"],["shop","🛒 تسوق"],["money","💰 مال"],["biz","📊 أعمال"],["life","🧭 حياة وصحة"],["text","🔤 نصوص وأمان"]];
    const TAB_CAT = {discount:"shop",unit:"shop",vat:"shop",compare:"shop",decide:"shop",total:"shop",installment:"shop",split:"shop",budget:"money",loan:"money",saving:"money",compound:"money",percent:"money",fx:"money",hourly:"money",margin:"biz",breakeven:"biz",bmi:"life",age:"life",zakat:"life",hijri:"life",trip:"life",dates:"life",convert:"life",grade:"life",wordcount:"text",password:"text"};
    const tabNav = root.querySelector(".sc-tabs");
    if (tabNav && root.querySelectorAll("[data-tab]").length > 12 && !root.querySelector(".sc-filter")) {
      const bar = document.createElement("div"); bar.className = "sc-filter";
      const q = document.createElement("input"); q.type = "search"; q.placeholder = "ابحث عن أداة…"; q.setAttribute("aria-label", "ابحث عن أداة");
      const chips = document.createElement("div"); chips.className = "sc-chips";
      let curCat = "all";
      const apply = () => { const term = q.value.trim();
        root.querySelectorAll("[data-tab]").forEach(b => { const tab = b.getAttribute("data-tab"); const okCat = curCat === "all" || tab === "assistant" || TAB_CAT[tab] === curCat; const okQ = !term || b.textContent.indexOf(term) > -1; b.style.display = okCat && okQ ? "" : "none"; }); };
      CATS.forEach(([id, label]) => { const c = document.createElement("button"); c.type = "button"; c.textContent = label; c.setAttribute("aria-pressed", String(id === "all")); c.addEventListener("click", () => { curCat = id; chips.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === c))); apply(); }); chips.appendChild(c); });
      q.addEventListener("input", apply); bar.appendChild(chips); bar.appendChild(q); tabNav.parentNode.insertBefore(bar, tabNav);
    }
    /* مقالات مرتبطة بكل أداة */
    const REL = {discount:["الخصم"],vat:["ضريبة"],unit:["سعر الوحدة"],budget:["ميزانية"],saving:["ادخار","طوارئ"],loan:["القرض"],installment:["التقسيط"],margin:["هامش","تسعير"],breakeven:["تسعير","التعادل"],compare:["تقارن"],decide:["تقارن","الكلية"],total:["الكلية","مستعمل"],compound:["ادخار","طوارئ"],hourly:["اشتراكات","ميزانية"],split:["ميزانية"],trip:["الكلية"],fx:["ميزانية"]};
    if (typeof fetch === "function" && /\/p\//.test(location.pathname)) {
      fetch("/feeds/posts/default?alt=json&max-results=60", { credentials: "omit" }).then(r => r.json()).then(d => {
        const posts = ((d.feed && d.feed.entry) || []).map(e => { const l = (e.link || []).filter(x => x.rel === "alternate")[0]; return { t: e.title.$t, u: l ? l.href : "" }; }).filter(x => x.u);
        root.querySelectorAll(".sc-tool").forEach(sec => { const key = sec.id.replace("sc-", ""); const kws = REL[key]; if (!kws || sec.querySelector(".sc-readmore")) return;
          const m = posts.filter(p => kws.some(k => p.t.indexOf(k) > -1)).slice(0, 2); if (!m.length) return;
          const box = document.createElement("div"); box.className = "sc-readmore"; const b = document.createElement("b"); b.textContent = "اقرأ أيضاً: "; box.appendChild(b);
          m.forEach((p, i) => { const a = document.createElement("a"); a.href = p.u; a.textContent = p.t; box.appendChild(a); if (i < m.length - 1) box.appendChild(document.createTextNode(" · ")); }); sec.appendChild(box); });
      }).catch(() => {});
    }
    function showTab(tab) {
      const btn=root.querySelector('[data-tab="'+tab+'"]'); if(!btn) return;
      root.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-selected", String(b===btn)));
      root.querySelectorAll(".sc-tool").forEach(section => { section.hidden = section.id !== "sc-" + tab; });
    }
    root.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
      const tab=btn.getAttribute("data-tab"); showTab(tab);
      try { history.replaceState(null, "", "#" + tab); } catch (e) {}
    }));
    discount(); budget(); unit(); percent(); saving(); total(); installment(); convert(); dates(); vat(); compare(); decide(); loan(); margin(); split(); compound(); breakeven(); hourly(); trip(); fx(); bmi(); age(); zakat(); grade(); wordcount(); genPassword(); decorateAll();
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
        "</div><p class='sc-more'><a href='" + tools + "'>عرض كل الأدوات (28 أداة) ←</a></p></section>" +
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

/* Smart Choice — لوحة الإدارة (للمالك). تعرض بيانات عامة غير سرية فقط: زيارات Blogger الحقيقية، الفحص الفني، جاهزية AdSense،
   المحتوى وروابط الإدارة. لا تعرض أرقاماً تجريبية أو أرباحاً (تحتاج ربطاً بحساب AdSense من خادم). */
(function () {
  "use strict";
  var RAW = "https://raw.githubusercontent.com/tahattaha41/Smart-Choice/main/";
  var REPO = "https://github.com/tahattaha41/Smart-Choice";
  var SALT = "smart-choice-admin-v1", HASH = "c8601e15655da80fa3388e066a0c6aa4b63d6cc287d3183b454efa82e9be1d5c", ITER = 150000;
  var NF = new Intl.NumberFormat("ar-EG");
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function a(href, text, cls) { var x = el("a", cls || null, text); x.href = href; x.target = "_blank"; x.rel = "noopener"; return x; }
  function get(path, json) {
    return fetch(RAW + path + "?t=" + Math.floor(Date.now() / 300000), { credentials: "omit" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return json ? r.json() : r.text(); });
  }
  function feed(kind) {
    return fetch("/feeds/" + kind + "/default?alt=json&max-results=150", { credentials: "omit" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { return ((j.feed && j.feed.entry) || []).map(function (e) { var l = (e.link || []).filter(function (x) { return x.rel === "alternate"; })[0]; return { title: e.title.$t, url: l ? l.href : "", date: (e.published && e.published.$t || "").slice(0, 10), labels: (e.category || []).map(function (c) { return c.term; }) }; }); });
  }
  function panel(title, sub) { var c = el("section", "adm-card"); if (title) { var h = el("div", "adm-h"); h.appendChild(el("h2", null, title)); if (sub) h.appendChild(el("span", "adm-sub", sub)); c.appendChild(h); } return c; }
  function stat(label, value, hint, tone) { var k = el("div", "adm-stat" + (tone ? " " + tone : "")); k.appendChild(el("span", "adm-lbl", label)); k.appendChild(el("b", null, value)); if (hint) k.appendChild(el("small", null, hint)); return k; }
  function badge(text, tone) { return el("span", "adm-badge " + (tone || ""), text); }
  function table(head, rows) {
    var t = el("table", "adm-table"), h = el("tr"); head.forEach(function (x) { h.appendChild(el("th", null, x)); }); t.appendChild(h);
    rows.forEach(function (r) { var tr = el("tr"); r.forEach(function (c) { var td = el("td"); if (c && c.nodeType) td.appendChild(c); else td.textContent = c; tr.appendChild(td); }); t.appendChild(tr); });
    var w = el("div", "adm-tbl"); w.appendChild(t); return w;
  }

  /* ---------- بوابة كلمة السر ---------- */
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function check(pw) {
    var enc = new TextEncoder();
    return Promise.resolve().then(function () { return crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]); }).then(function (k) {
      return crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(SALT), iterations: ITER, hash: "SHA-256" }, k, 256);
    }).then(function (bits) { return hex(bits) === HASH; });
  }
  function unlocked() { try { return sessionStorage.getItem("sc-admin") === HASH; } catch (e) { return false; } }

  /* ---------- البيانات ---------- */
  var D = { stats: null, hist: [], audit: null, e2e: null, posts: [], pages: [], bots: { measured: {}, estimated: {} } };
  function botDay(d) { return (D.bots.measured[d] || 0) + (D.bots.estimated[d] || 0); }
  function botSince(days) { var lim = Date.now() - days * 86400000, n = 0, all = {}; Object.keys(D.bots.measured).concat(Object.keys(D.bots.estimated)).forEach(function (k) { all[k] = 1; }); Object.keys(all).forEach(function (k) { if (days == null || new Date(k + "T23:59:59Z").getTime() >= lim) n += botDay(k); }); return n; }
  function load() {
    return Promise.all([
      get("reports/stats.json", true).then(function (x) { D.stats = x; }).catch(function () {}),
      get("reports/bot-views.json", true).then(function (x) { D.bots = x; }).catch(function () {}),
      get("reports/stats-history.json", true).then(function (x) { D.hist = x; }).catch(function () {}),
      get("reports/adsense-audit.json", true).then(function (x) { D.audit = x; }).catch(function () {}),
      get("reports/live-e2e.txt", false).then(function (t) {
        D.e2e = t.split("\n").filter(function (l) { return /^(OK|FAIL|WARN) /.test(l); }).map(function (l) { return { lvl: l.split(/\s/)[0], msg: l.replace(/^(OK|FAIL|WARN)\s+/, "") }; });
      }).catch(function () {}),
      feed("posts").then(function (x) { D.posts = x; }).catch(function () {}),
      feed("pages").then(function (x) { D.pages = x; }).catch(function () {})
    ]);
  }
  function attention() {
    var items = [];
    (D.e2e || []).forEach(function (x) { if (x.lvl === "FAIL") items.push({ tone: "bad", text: "فحص فني فاشل: " + x.msg }); if (x.lvl === "WARN") items.push({ tone: "warn", text: x.msg }); });
    ((D.audit && D.audit.checks) || []).forEach(function (x) { if (x.level === "fail" || x.level === "warn") items.push({ tone: x.level === "fail" ? "bad" : "warn", text: x.title + (x.detail ? " — " + x.detail : "") + (x.fix ? " (الحل: " + x.fix + ")" : "") }); });
    return items;
  }

  /* ---------- التبويبات ---------- */
  function chart(host) {
    var h = D.hist || []; if (h.length < 2) { host.appendChild(el("p", "adm-muted", "يتراكم الرسم البياني يوماً بعد يوم؛ تظهر المقارنة بعد يومين من التشغيل.")); return; }
    var days = []; for (var i = 1; i < h.length; i++) days.push({ d: h[i].date, v: Math.max(0, h[i].all - h[i - 1].all - botDay(h[i].date)) });
    days = days.slice(-30); var max = Math.max.apply(null, days.map(function (x) { return x.v; }).concat([1]));
    var box = el("div", "adm-bars");
    days.forEach(function (x) { var b = el("div", "adm-bar"); var f = el("i"); f.style.height = Math.max(3, Math.round(x.v / max * 100)) + "%"; f.title = x.d + ": " + x.v; b.appendChild(f); box.appendChild(b); });
    host.appendChild(box); host.appendChild(el("p", "adm-muted", "مشاهدات الصفحات يومياً (آخر " + days.length + " يوماً)."));
  }
  function tabOverview(root) {
    var s = D.stats, kp = el("div", "adm-stats");
    if (s) {
      kp.appendChild(stat("زوار 7 أيام", NF.format(Math.max(0, s.d7 - botSince(7))), "بعد استبعاد الفحص الآلي"));
      kp.appendChild(stat("زوار 30 يوماً", NF.format(Math.max(0, s.d30 - botSince(30))), "بعد استبعاد الفحص الآلي"));
      kp.appendChild(stat("إجمالي الزوار", NF.format(Math.max(0, s.all - botSince(null))), "منذ إنشاء المدونة"));
    } else kp.appendChild(stat("المشاهدات", "—", "تُحدَّث يومياً؛ لم يصدر أول تقرير بعد"));
    kp.appendChild(stat("المقالات", NF.format(D.posts.length), "منشورة"));
    var fails = (D.e2e || []).filter(function (x) { return x.lvl === "FAIL"; }).length, tot = (D.e2e || []).filter(function (x) { return x.lvl !== "WARN"; }).length;
    kp.appendChild(stat("الفحص الفني", D.e2e ? (tot - fails) + "/" + tot : "—", fails ? "فحوص تحتاج مراجعة" : "كل شيء يعمل", fails ? "bad" : "good"));
    var sc = D.audit ? D.audit.score : null;
    kp.appendChild(stat("جاهزية AdSense", sc != null ? sc + "%" : "—", "فحص آلي للمعايير", sc != null && sc >= 90 ? "good" : "warn"));
    root.appendChild(kp);
    var c1 = panel("الزيارات", "مصدر الأرقام: Blogger بعد استبعاد زيارات الفحص الآلي"); chart(c1);
    if (s) c1.appendChild(el("p", "adm-muted", "آخر تحديث: " + s.updated + " — الفحص الآلي المستبعد: " + NF.format(botSince(null)) + " زيارة (جزء منها تقديري للأيام الأولى)."));
    var own = el("div", "adm-own"); own.appendChild(el("p", "adm-muted", "زياراتك أنت: اضغط الزر لاستبعاد هذا الجهاز من Google Analytics (علامة محلية في متصفحك). لاستبعادها من إحصائيات Blogger نفسها فعّل خيار عدم تتبع مشاهداتك الخاصة في إعدادات بلوجر؛ لا يمكن للموقع التحكم فيه."));
    var ob = el("button", "adm-btn", (function () { try { return localStorage.getItem("sc-owner") === "1" ? "هذا الجهاز مستبعد ✓" : "استبعد هذا الجهاز من التحليلات"; } catch (e) { return "استبعد هذا الجهاز من التحليلات"; } })()); ob.type = "button";
    ob.addEventListener("click", function () { try { localStorage.setItem("sc-owner", "1"); ob.textContent = "هذا الجهاز مستبعد ✓"; } catch (e) { ob.textContent = "المتصفح يمنع التخزين"; } });
    own.appendChild(ob); c1.appendChild(own);
    root.appendChild(c1);
    var c2 = panel("يحتاج انتباهك"), it = attention();
    if (!it.length) c2.appendChild(el("p", "adm-ok", "لا توجد مشكلات مكتشفة. ✓"));
    else { var ul = el("ul", "adm-list"); it.forEach(function (x) { var li = el("li"); li.appendChild(badge(x.tone === "bad" ? "عاجل" : "تنبيه", x.tone)); li.appendChild(el("span", null, " " + x.text)); ul.appendChild(li); }); c2.appendChild(ul); }
    root.appendChild(c2);
  }
  function composer(root) {
    var c = panel("كتابة مقال جديد", "يُنشر تلقائياً بعد الحفظ في GitHub");
    var f = el("div", "adm-form");
    function field(label, tag, ph) { var l = el("label", null, label); var i = el(tag); if (ph) i.placeholder = ph; if (tag === "textarea") i.rows = 10; l.appendChild(i); f.appendChild(l); return i; }
    var title = field("عنوان المقال", "input", "عنوان واضح يصف الفائدة"), labels = field("التصنيف", "input", "التسوق الذكي"), body = field("نص المقال (HTML بسيط: ‎<p> ‎<h2> ‎<ul>)", "textarea", "<p>…</p>");
    c.appendChild(f);
    var go = el("button", "adm-btn", "فتح GitHub لنشر المقال"); go.type = "button";
    go.addEventListener("click", function () {
      var t = title.value.trim(), b = body.value.trim(); if (!t || !b) { alert("اكتب العنوان والنص أولاً."); return; }
      var slug = "post-" + new Date().toISOString().slice(0, 10) + "-" + Math.random().toString(36).slice(2, 6);
      var md = "---\ntitle: " + t + "\nlabels: " + (labels.value.trim() || "Smart Choice") + "\npublish: true\n---\n" + b + "\n";
      window.open(REPO + "/new/main/posts?filename=" + encodeURIComponent(slug + ".md") + "&value=" + encodeURIComponent(md), "_blank", "noopener");
    });
    c.appendChild(go); root.appendChild(c);
  }
  function tabContent(root) {
    composer(root);
    var c = panel("المقالات (" + NF.format(D.posts.length) + ")", "من خلاصة المدونة الحية");
    c.appendChild(table(["العنوان", "التصنيف", "التاريخ"], D.posts.map(function (p) { return [a(p.url, p.title), p.labels.join("، "), p.date]; })));
    root.appendChild(c);
    var c2 = panel("الصفحات (" + NF.format(D.pages.length) + ")");
    c2.appendChild(table(["العنوان", "الرابط"], D.pages.map(function (p) { return [p.title.replace(/\s*\|\s*Smart Choice\s*$/i, ""), a(p.url, "فتح")]; })));
    root.appendChild(c2);
  }
  function tabQuality(root) {
    var d = D.audit;
    var c = panel("جاهزية AdSense", d ? "النتيجة " + d.score + "% — " + d.posts + " مقالاً بمتوسط " + d.avg_words + " كلمة" : "لم يصدر التقرير بعد");
    if (d) {
      var bad = d.checks.filter(function (x) { return x.level === "fail" || x.level === "warn"; }), good = d.checks.filter(function (x) { return x.level === "pass"; });
      if (bad.length) { var ul = el("ul", "adm-list"); bad.forEach(function (x) { var li = el("li"); li.appendChild(badge(x.level === "fail" ? "إصلاح" : "تحسين", x.level === "fail" ? "bad" : "warn")); li.appendChild(el("span", null, " " + x.title + (x.detail ? " — " + x.detail : "") + (x.fix ? " | الحل: " + x.fix : ""))); ul.appendChild(li); }); c.appendChild(ul); }
      else c.appendChild(el("p", "adm-ok", "كل معايير الفحص الآلي مستوفاة. ✓"));
      var det = el("details"); det.appendChild(el("summary", null, "المعايير المستوفاة (" + good.length + ")")); var ul2 = el("ul", "adm-list"); good.forEach(function (x) { ul2.appendChild(el("li", null, "✓ " + x.title)); }); det.appendChild(ul2); c.appendChild(det);
    }
    root.appendChild(c);
    var c2 = panel("خطوات المالك قبل/بعد التقديم", "تُحفظ علاماتك في هذا المتصفح");
    var steps = ["تفعيل ads.txt في إعدادات بلوجر (الأرباح).", "تسجيل الموقع في Search Console وإرسال sitemap.xml.", "انتظار فهرسة الصفحات في جوجل (أسبوع إلى أسبوعين).", "طلب مراجعة الموقع من حساب AdSense.", "تنظيف حسابات Utilityra القديمة في AdSense وAnalytics.", "إلغاء أي مفاتيح سرية سبق تسريبها وإنشاء بدائل."];
    var ul3 = el("ul", "adm-checks"), store = {}; try { store = JSON.parse(localStorage.getItem("sc-adm-steps") || "{}"); } catch (e) {}
    steps.forEach(function (t, i) { var li = el("li"), lb = el("label"), cb = el("input"); cb.type = "checkbox"; cb.checked = !!store[i];
      cb.addEventListener("change", function () { store[i] = cb.checked; try { localStorage.setItem("sc-adm-steps", JSON.stringify(store)); } catch (e) {} });
      lb.appendChild(cb); lb.appendChild(el("span", null, " " + t)); li.appendChild(lb); ul3.appendChild(li); });
    c2.appendChild(ul3); root.appendChild(c2);
  }
  function tabTech(root) {
    var e = D.e2e || [], fails = e.filter(function (x) { return x.lvl === "FAIL"; });
    var c = panel("الفحص الفني للموقع الحي", "يعمل تلقائياً يومياً وعند كل تعديل");
    c.appendChild(el("p", fails.length ? "adm-bad" : "adm-ok", e.length ? (fails.length ? fails.length + " فحص فاشل" : "كل الفحوصات ناجحة ✓") : "لا يوجد تقرير بعد"));
    if (fails.length) { var ul = el("ul", "adm-list"); fails.forEach(function (x) { ul.appendChild(el("li", null, "✗ " + x.msg)); }); c.appendChild(ul); }
    var det = el("details"); det.appendChild(el("summary", null, "عرض كل الفحوصات (" + e.length + ")")); det.appendChild(table(["الحالة", "الفحص"], e.map(function (x) { return [badge(x.lvl === "OK" ? "ناجح" : (x.lvl === "WARN" ? "تنبيه" : "فاشل"), x.lvl === "OK" ? "good" : (x.lvl === "WARN" ? "warn" : "bad")), x.msg.length > 140 ? x.msg.slice(0, 140) + "…" : x.msg]; }))); c.appendChild(det);
    root.appendChild(c);
  }
  function tabLinks(root) {
    var c = panel("الخدمات المتصلة");
    c.appendChild(table(["الخدمة", "الحالة", "ملاحظة"], [
      ["Google Analytics 4", badge("مثبّت", "good"), "يقيس الزيارات التفصيلية؛ الأرقام الكاملة من لوحته."],
      ["Google AdSense", badge("الكود مثبّت", "good"), "ظهور الإعلانات مرهون بموافقة جوجل. لا نعرض أرباحاً هنا لأنها تتطلب ربطاً بحسابك."],
      ["GitHub Actions", badge("يعمل", "good"), "المزامنة والفحص والتقارير تلقائية."]
    ])); root.appendChild(c);
    var c2 = panel("روابط سريعة"), g = el("div", "adm-links");
    [["المستودع", REPO], ["المقالات", REPO + "/tree/main/posts"], ["الصفحات والأدوات", REPO + "/tree/main/pages"], ["سجل العمليات", REPO + "/actions"], ["لوحة Blogger", "https://www.blogger.com"], ["Google Analytics", "https://analytics.google.com"], ["Google AdSense", "https://adsense.google.com"], ["Search Console", "https://search.google.com/search-console"]]
      .forEach(function (x) { g.appendChild(a(x[1], x[0], "adm-link")); });
    c2.appendChild(g); root.appendChild(c2);
  }
  var TABS = [["overview", "نظرة عامة", tabOverview], ["content", "المحتوى", tabContent], ["quality", "الجودة وAdSense", tabQuality], ["tech", "الفحص الفني", tabTech], ["links", "الروابط والخدمات", tabLinks]];
  function dashboard(root) {
    root.textContent = ""; root.className = "adm";
    var bar = el("div", "adm-tabs"), body = el("div", "adm-body");
    var out = el("button", "adm-out", "خروج"); out.type = "button"; out.addEventListener("click", function () { try { sessionStorage.removeItem("sc-admin"); } catch (e) {} location.reload(); });
    function show(id) {
      Array.prototype.forEach.call(bar.querySelectorAll("button[data-t]"), function (b) { b.setAttribute("aria-selected", String(b.dataset.t === id)); });
      body.textContent = ""; TABS.forEach(function (t) { if (t[0] === id) t[2](body); });
    }
    TABS.forEach(function (t) { var b = el("button", null, t[1]); b.type = "button"; b.dataset.t = t[0]; b.addEventListener("click", function () { show(t[0]); }); bar.appendChild(b); });
    bar.appendChild(out); root.appendChild(bar); root.appendChild(body);
    body.appendChild(el("p", "adm-muted", "جارٍ تحميل البيانات…"));
    load().then(function () { show("overview"); });
  }
  function run() {
    var root = document.getElementById("sc-admin-root");
    if (!root || root.dataset.scReady) return;
    root.dataset.scReady = "1";
    var m = document.createElement("meta"); m.name = "robots"; m.content = "noindex,nofollow"; document.head.appendChild(m);
    if (unlocked()) { dashboard(root); return; }
    root.textContent = "";
    var c = panel("دخول الإدارة"); c.appendChild(el("p", "adm-muted", "هذه الصفحة خاصة بمالك الموقع. أدخل كلمة السر للمتابعة."));
    var inp = el("input", "adm-input"); inp.type = "password"; inp.autocomplete = "current-password"; inp.placeholder = "كلمة السر"; inp.setAttribute("aria-label", "كلمة السر");
    var btn = el("button", "adm-btn", "دخول"); btn.type = "button"; var msg = el("p", "adm-bad", "");
    function submit() { check(inp.value).then(function (ok) { if (ok) { try { sessionStorage.setItem("sc-admin", HASH); localStorage.setItem("sc-owner", "1"); } catch (e) {} dashboard(root); } else { msg.textContent = "كلمة السر غير صحيحة."; inp.value = ""; } }).catch(function () { msg.textContent = "المتصفح لا يدعم التحقق."; }); }
    btn.addEventListener("click", submit); inp.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    c.appendChild(inp); c.appendChild(btn); c.appendChild(msg); root.appendChild(c);
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
