# Naz Madencilik — İş Kuyruğu

Sıra kullanıcı onayıyla ilerler. Her adım bitince işaretlenir.

- [x] **1. Faaliyet Alanları** — tam ekran sahne + slider + tıklamayla arka plan
      crossfade. (Bitti, 2026-07-28. Ekleri de bitti: 6 sütun + tek-sütun adım,
      düşük çözünürlük işlemesi (blur+grain+overlay), hücrelerde kendi net
      fotoğrafları + durum merdiveni.)
- [ ] **1b. Header/topbar yeniden düzenleme** — Teklif Alın topbar'a metin-link,
      dil seçici header'a; tema-duyarlı şeffaf cam header (data-theme + IO).
      (Bağlantı kesintisiyle uygulanamadı — SIRADA, onayla başlanacak.)
- [ ] **2. Ürün Portföyü** — Gavia "04 / Vaka çalışmaları" kart yapısına dönüşüm
- [ ] **3. Kurumsal** — Gavia bölüm ritmine oturtma
- [ ] **4. Eşit yükseklik + snap turu** — tanımı aşağıda; TÜM bölümler son halini
      almadan UYGULANMAZ (erken ölçüm boşa gider)
- [ ] **5. Faz 2** — EN sayfası + EN yasal sayfalar
- [ ] **6. Faz 3** — a11y, SEO/OG, Lighthouse
- [ ] **7. Faz 4** — repo + GitHub Pages deploy

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
