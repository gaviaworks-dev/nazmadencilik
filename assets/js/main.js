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

  /* --- Header tema senkronu (R9) -----------------------------------------
     Header tamamen saydam; yazı/logo rengi ALTINDAKİ bölümün data-theme'ine
     göre değişir. IO, bölümleri header bandında izleyip senkronu tetikler;
     onScroll'daki ucuz doğrulama hızlı kaydırmada IO gecikmesini kapatır. */
  var themedSections = Array.prototype.slice.call(document.querySelectorAll("[data-theme]"));
  function syncHeaderTheme() {
    if (!header || !themedSections.length) return;
    var probe = (header.classList.contains("is-stuck") ? 0 : topbarH()) + header.offsetHeight * 0.6;
    var theme = "dark"; // varsayılan: hero/page-head koyu
    for (var i = 0; i < themedSections.length; i++) {
      var r = themedSections[i].getBoundingClientRect();
      /* break YOK — perde yüzünden sticky hero viewport'ta kalır; boyanma
         sırasında SONRAKİ bölüm öncekini örter, bu yüzden probe'u kapsayan
         EN SON (en üstte boyanan) bölüm kazanmalı. (R10 teşhis bulgusu:
         break'li hali hero'yu bulup Kurumsal'da header'ı koyu bırakıyordu.) */
      if (r.top <= probe && r.bottom > probe) { theme = themedSections[i].getAttribute("data-theme"); }
    }
    header.classList.toggle("theme-dark", theme === "dark");
    header.classList.toggle("theme-light", theme === "light");
  }
  if (themedSections.length && "IntersectionObserver" in window) {
    var themeIO = new IntersectionObserver(function () { syncHeaderTheme(); },
      { rootMargin: "0px 0px -85% 0px" });
    themedSections.forEach(function (s) { themeIO.observe(s); });
  }

  /* Perde ilerlemesi (R10): hero'nun örtülme oranı CSS değişkenine yazılır;
     tam örtülünce hero katmandan ve sekme sırasından çıkarılır. */
  var heroCurtain = document.querySelector(".hero--curtain");
  function syncCurtain() {
    if (!heroCurtain) return;
    var p = Math.min(1, Math.max(0, window.scrollY / (heroCurtain.offsetHeight || 1)));
    heroCurtain.style.setProperty("--curtain-p", p.toFixed(3));
    /* visibility DEĞİL inert: snap alanı korunur, odak/etkileşim kesilir */
    if (p >= 1) { heroCurtain.setAttribute("inert", ""); }
    else { heroCurtain.removeAttribute("inert"); }
  }
  function onScroll() {
    if (header) header.classList.toggle("is-stuck", window.scrollY >= topbarH());
    syncHeaderTheme();
    syncCurtain();
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
      /* Sahne tam ekran gerildiği için 2× (Lanczos+unsharp) set kullanır;
         hücre fotoğrafları 1x kalır (orada zaten net). */
      var url = btn.getAttribute("data-bg-full") || btn.getAttribute("data-bg");
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
        var cellUrl = b.getAttribute("data-bg");
        var fullUrl = b.getAttribute("data-bg-full") || cellUrl;
        var photo = b.querySelector(".axis-photo");
        whenReady(cellUrl, function () {
          if (photo) {
            photo.style.backgroundImage = 'url("' + cellUrl + '")';
            photo.classList.add("is-loaded");
          }
        });
        whenReady(fullUrl, function () {
          if (i === 0) setBg(fullUrl);
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

  /* --- Kurumsal galerisi (R13, Akçelik deseni) ---------------------------
     Küçük görsele tıklayınca büyük kare değişir; aktif küçük işaretlenir. */
  var gallery = document.querySelector(".about-gallery");
  if (gallery) {
    var galleryMain = gallery.querySelector(".gallery-main img");
    var galleryThumbs = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-thumb"));
    var galleryUrls = galleryThumbs.map(function (t) { return t.getAttribute("data-full"); });
    var lightbox = document.getElementById("galeri-lightbox");
    var lbImg = lightbox && lightbox.querySelector(".lightbox-img");
    var lbIndex = 0;
    function lbShow(i) {
      lbIndex = (i + galleryUrls.length) % galleryUrls.length;
      lbImg.src = galleryUrls[lbIndex];
    }
    function lbOpen(i) {
      if (!lightbox || !lightbox.showModal) return;
      lbShow(i);
      lightbox.showModal();
    }
    galleryThumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () {
        galleryThumbs.forEach(function (o) { o.classList.toggle("is-active", o === thumb); });
        galleryMain.src = thumb.getAttribute("data-full");
        lbOpen(i); /* R14: tıklanınca galeri tam ekran açılır */
      });
    });
    galleryMain.addEventListener("click", function () {
      lbOpen(Math.max(0, galleryUrls.indexOf(galleryMain.getAttribute("src"))));
    });
    if (lightbox) {
      lightbox.querySelector(".lightbox-close").addEventListener("click", function () { lightbox.close(); });
      lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { lbShow(lbIndex - 1); });
      lightbox.querySelector(".lightbox-next").addEventListener("click", function () { lbShow(lbIndex + 1); });
      lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
      lightbox.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
        if (e.key === "ArrowRight") lbShow(lbIndex + 1);
      });
    }
  }

  /* --- Çerez bilgilendirme bandı (R12, desil deseni) ----------------------
     Site birinci taraf çerez kullanmaz; band bilgilendirme + onay içindir.
     Tercih localStorage'da (çerez değil). Tüm sayfalara buradan enjekte olur. */
  try {
    if (!localStorage.getItem("naz-consent")) {
      /* Metinler sayfanın html[lang]'ine göre seçilir (EN sayfalar dahil tek dosya) */
      var isEN = (document.documentElement.lang || "tr").toLowerCase().indexOf("en") === 0;
      var consent = document.createElement("div");
      consent.className = "consent-banner";
      consent.setAttribute("role", "region");
      consent.setAttribute("aria-label", isEN ? "Cookie notice" : "Çerez bilgilendirmesi");
      consent.innerHTML =
        '<div class="container consent-inner">' +
        (isEN
          ? '<p class="consent-text">This site does not set any cookies of its own; only when the map in the Contact section is displayed may Google\'s technical cookies come into play. See the <a href="cookie-policy.html">Cookie Policy</a> for details.</p>' +
            '<button class="btn btn--primary btn--sm" type="button">I accept</button>'
          : '<p class="consent-text">Bu site kendi adına çerez kullanmaz; yalnızca İletişim bölümündeki harita görüntülendiğinde Google\'ın teknik çerezleri devreye girebilir. Ayrıntı için <a href="cerez-politikasi.html">Çerez Politikası</a>.</p>' +
            '<button class="btn btn--primary btn--sm" type="button">Kabul ediyorum</button>') +
        '</div>';
      document.body.appendChild(consent);
      consent.querySelector("button").addEventListener("click", function () {
        try { localStorage.setItem("naz-consent", "1"); } catch (e) {}
        consent.remove();
      });
    }
  } catch (e) { /* localStorage kapalıysa band her ziyarette görünür, site çalışır */ }

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
