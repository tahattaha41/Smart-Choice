/* Smart Choice tools — shared, scoped, dependency-free */
(function () {
  "use strict";
  function init(root) {
    if (!root || root.dataset.scReady === "true") return;
    root.dataset.scReady = "true";
    const $ = (id) => root.querySelector("#" + id);
    const value = (id) => {
      const el = $(id);
      return el ? Number(el.value) : NaN;
    };
    const fmt = (n) => new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 }).format(n);
    const put = (id, text) => { const el = $(id); if (el) el.textContent = text; };
    function discount() {
      const price = value("sc-price"), rate = value("sc-rate");
      const valid = Number.isFinite(price) && Number.isFinite(rate) && price >= 0 && rate >= 0 && rate <= 100;
      put("sc-final", valid ? fmt(price * (1 - rate / 100)) : "تحقق من المدخلات");
      put("sc-saving", valid ? fmt(price * rate / 100) : "—");
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
    const handlers = {
      "sc-price": discount, "sc-rate": discount,
      "sc-income": budget, "sc-expenses": budget,
      "sc-p1": unit, "sc-q1": unit, "sc-p2": unit, "sc-q2": unit
    };
    Object.keys(handlers).forEach(id => {
      const el=$(id);
      if (el) el.addEventListener("input", handlers[id]);
    });
    root.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
      const tab=btn.getAttribute("data-tab");
      root.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-selected", String(b===btn)));
      root.querySelectorAll(".sc-tool").forEach(section => { section.hidden = section.id !== "sc-" + tab; });
    }));
    discount(); budget(); unit();
  }
  function start() {
    document.querySelectorAll(".sc-page").forEach(init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();