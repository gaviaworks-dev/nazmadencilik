/* ==========================================================================
   NAZ MADENCİLİK — main.js
   Hafif etkileşimler (desil deseni): sticky header · mobil menü · faaliyet
   eksen sahnesi (crossfade + slider) · scroll-reveal. Kütüphane yok.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Topbar + sticky header --------------------------------------------
     Topbar akışta durur; header absolute top:var(--topbar-h) başlar. Scroll
     topbar yüksekliğine ulaştığı anda is-stuck header'ı fixed top:0'a alır —
     geçiş pikselde dikişsizdir. --topbar-h JS ölçümüyle gerçek yükseklikte
     tutulur (mobilde satır yüksekliği değişebilir). */
  var header = document.querySelector(".site-header");
  var topbar = document.querySelector(".topbar");
  function topbarH() { return topbar ? topbar.offsetHeight : 0; }
  function syncTopbar() {
    document.documentElement.style.setProperty("--topbar-h", topbarH() + "px");
  }
  syncTopbar();
  window.addEventListener("resize", syncTopbar);
  function onScroll() {
    if (header) header.classList.toggle("is-stuck", window.scrollY >= topbarH());
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Mobil menü -------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  function closeNav() {
    document.body.classList.remove("nav-open");
    if (nav) nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    // Masaüstüne dönünce menüyü sıfırla
    window.matchMedia("(min-width: 901px)").addEventListener("change", closeNav);
  }

  /* --- Faaliyet eksen sahnesi (R7) ---------------------------------------
     Tıklamayla aktif sektör + full-bleed arka planda iki katmanlı crossfade.
     Görseller bölüm 1 viewport mesafeye gelince topluca ön-yüklenir (sayfa
     yüküne binmez, tıklamada beyaz boşluk oluşmaz). reduced-motion'da
     crossfade süresi token'la 0'a iner (anında değişim). */
  var stage = document.querySelector(".axes-stage");
  if (stage) {
    var layers = stage.querySelectorAll(".axes-bg-layer");
    var axisButtons = Array.prototype.slice.call(stage.querySelectorAll(".axis"));
    var track = stage.querySelector(".axes-track");
    var prevBtn = stage.querySelector(".axes-btn--prev");
    var nextBtn = stage.querySelector(".axes-btn--next");
    var progressBar = stage.querySelector(".axes-progress-bar");
    var frontLayer = 0;
    var preloaded = false;

    function setBg(url) {
      var back = layers[1 - frontLayer];
      back.style.backgroundImage = 'url("' + url + '")';
      void back.offsetWidth; // senkron reflow: transition sınıf değişimini görsün
      back.classList.add("is-visible");
      layers[frontLayer].classList.remove("is-visible");
      frontLayer = 1 - frontLayer;
    }
    function whenReady(url, cb) { // cache'ten gelen görselde onload atlanabilir
      var im = new Image();
      im.onload = cb;
      im.src = url;
      if (im.complete) { im.onload = null; cb(); }
    }
    function activateAxis(btn) {
      axisButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      var url = btn.getAttribute("data-bg");
      whenReady(url, function () { setBg(url); });
    }
    axisButtons.forEach(function (b, i) {
      b.addEventListener("click", function () { activateAxis(b); });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var target = axisButtons[Math.min(axisButtons.length - 1, Math.max(0, i + d))];
        target.focus();
        target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: prefersReduced ? "auto" : "smooth" });
      });
    });

    function preloadAll() {
      if (preloaded) return;
      preloaded = true;
      axisButtons.forEach(function (b, i) {
        var url = b.getAttribute("data-bg");
        var photo = b.querySelector(".axis-photo");
        whenReady(url, function () {
          if (photo) {
            photo.style.backgroundImage = 'url("' + url + '")';
            photo.classList.add("is-loaded");
          }
          if (i === 0) setBg(url);
        });
      });
    }
    if ("IntersectionObserver" in window) {
      var stageIO = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          preloadAll();
          stageIO.disconnect();
        }
      }, { rootMargin: "100% 0px" });
      stageIO.observe(stage);
    } else {
      preloadAll();
    }
    /* Emniyet kemeri: IO'dan bağımsız yakınlık kontrolü (anchor ile doğrudan
       atlamalar dahil). preloaded bayrağı çift tetiği zaten yutuyor. */
    function preloadIfNear() {
      if (preloaded) { window.removeEventListener("scroll", preloadIfNear); return; }
      if (stage.getBoundingClientRect().top < window.innerHeight * 2) {
        preloadAll();
        window.removeEventListener("scroll", preloadIfNear);
      }
    }
    window.addEventListener("scroll", preloadIfNear, { passive: true });
    preloadIfNear();

    /* Oklar + ilerleme çizgisi (desil carousel deseni: scrollBy + snap) */
    if (track) {
      function syncTrack() {
        var max = track.scrollWidth - track.clientWidth;
        if (progressBar) progressBar.style.width = max > 0 ? (track.scrollLeft / max) * 100 + "%" : "100%";
        if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
        if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 2;
      }
      track.addEventListener("scroll", syncTrack, { passive: true });
      window.addEventListener("resize", syncTrack);
      syncTrack();
      function nudge(dir) {
        /* R8: sayfa atlamak yerine TEK sütun ilerler; uçta ok pasifleşir
           (döngü yerine pasif: mevcut disabled deseniyle tutarlı, uç hissi net) */
        var col = axisButtons.length ? axisButtons[0].offsetWidth : track.clientWidth / 6;
        track.scrollBy({ left: dir * col, behavior: prefersReduced ? "auto" : "smooth" });
      }
      if (prevBtn) prevBtn.addEventListener("click", function () { nudge(-1); });
      if (nextBtn) nextBtn.addEventListener("click", function () { nudge(1); });
    }
  }

  /* --- Scroll-reveal (hafif) -------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
