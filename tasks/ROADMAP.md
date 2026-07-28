# Naz Madencilik — İş Kuyruğu

Sıra kullanıcı onayıyla ilerler. Her adım bitince işaretlenir.

- [x] **1. Faaliyet Alanları** — tam ekran sahne + slider + tıklamayla arka plan
      crossfade. (Bitti, 2026-07-28. Ekleri de bitti: 6 sütun + tek-sütun adım,
      düşük çözünürlük işlemesi (blur+grain+overlay), hücrelerde kendi net
      fotoğrafları + durum merdiveni.)
- [x] **1b. Header/topbar yeniden düzenleme (R9)** — Teklif Alın topbar'a
      metin-link, dil seçici header'a; tamamen saydam tema-duyarlı header
      (data-theme + IO); TÜM ana bölümler tam 100svh, arka plan viewport
      tepesinden. (Bitti, 2026-07-28 — 4. adımın "eşit yükseklik" yarısı da
      bununla geldi; sıkıştırma/snap ölçüm turu 4. adımda.)
- [x] **2. Ürün Portföyü** — Gavia "04 / Vaka çalışmaları" kart yapısına dönüşüm
      (Bitti — handoff 2026-07-28: "Gavia hizmet kartları"; işaret sonradan kondu.)
- [x] **3. Kurumsal** — Gavia bölüm ritmine oturtma (Bitti — handoff 2026-07-28:
      galeri + lightbox + rozet; işaret sonradan kondu.)
- [x] **4. Eşit yükseklik + snap turu** — tanımı aşağıda (Bitti — handoff 2026-07-28:
      5 bölüm tam 100svh eşit, `y mandatory` snap iki yönde Playwright ile doğrulandı;
      işaret sonradan kondu.)
- [x] **5. Faz 2** — EN sayfası + EN yasal sayfalar (Bitti, 2026-07-28: `en.html` +
      `kvkk-notice.html` + `privacy-policy.html` + `cookie-policy.html`; hreflang
      çiftleri tüm sayfalarda; çerez bandı `html[lang]`'e göre iki dilli; DOM
      birebirliği ve linkler script'le, etkileşimler headless Chrome ile doğrulandı.)
- [ ] **6. Faz 3** — a11y, SEO/OG, Lighthouse. Ölçüm turu yapıldı (2026-07-28;
      skorlar: P 94-100 / A 96-100 / BP 100 / SEO 54 — SEO düşüşü kasıtlı
      noindex + göreli hreflang'dan ibaret). Bu turda düzeltildi: K1 klavye-snap
      çakışması, K2 kontrast (--ink-muted #747982→#70757E, kullanıcı onaylı
      global token koyulaştırma, 4.63:1 AA), Ö3 landmark rolleri, Z3 harita
      odak halkası. Sonuç: axe 3 sayfada temiz, Lighthouse A11y 100.
      - ERTELENDİ (görsel kalite riski, ayrı turda yapılacak): **Ö1** hero
        görseli yeniden sıkıştırma (~152KB tasarruf, mobil LCP 2.7s→) ve
        **Ö2** kart/thumb görsellerine küçük varyant + srcset (~200KB).
      - BEKLEMEDE (custom domain kararı): canonical, OG/Twitter meta seti,
        og-image, hreflang'ların mutlak URL'ye çevrilmesi.
- [x] **7. Faz 4 (önizleme)** — public repo + GitHub Pages deploy yapıldı (2026-07-28,
      noindex+robots ile). Yayına açılış: yasal onay + form servisi sonrası.

---

## 4. adımın onaylı tanımı (uygulama zamanı gelince buradan okunacak)

HEDEF: her ana bölüm tam ekran yüksekliğinde; snap ettiğinde yarım içerik görünmesin.

### 1. Eşit yükseklik
- Kurumsal, Ürün Portföyü, Faaliyet Alanları, İletişim → hepsi `min-height: 100svh`
  (Hero zaten öyle). Değer `tokens.css`'te TEK token'dan yönetilir.
- İçerik dikeyde ortalanır; üstte/altta simetrik nefes.
- Bölüm başlangıcı header altında kalmaz: `scroll-margin-top` + `padding-top`.

### 2. İçerik sığmıyorsa — KRİTİK
Sığmayan içerik KESİLMEZ. Sırayla:
a) Düzeni sıkıştır: iki sütun, boşluk ölçeklerini kıs, tipografi clamp alt ucu,
   görselleri küçült. Metin ASLA silinmez/kısaltılmaz.
b) Hâlâ sığmıyorsa o bölümün `min-height`'ı gevşer (auto) ve snap-align'ı kalkar.
   Yarım gösterip kesmektense snap'ten çıkar.
c) Her bölümün gerçek yüksekliği ÖLÇÜLÜR ve rakamla bildirilir:
   1440×900, 1366×768, 1280×720 — hangisi sığıyor, hangisi taşıyor.

### 3. Kapsam dışı
- Footer: 100svh olmaz, doğal yükseklik, snap yok.
- Yasal sayfalar: dokunulmaz, snap yok.
- Mobil (<900px) ve kısa ekran (<700px): eşit yükseklik ve snap KAPALI.

### 4. Doğrulama
- Footer'a her koşulda ulaşılıyor mu
- Momentum scroll'da kilitlenme var mı
- Tab ile odaklanan element ekran dışında kalıyor mu
- Nav anchor'ları doğru yere gidiyor mu
- Konsolda hata/404 yok
