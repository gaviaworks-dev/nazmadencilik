# Naz Madencilik — Kurumsal Site

Naz Madencilik (nazmadencilik.com.tr) kurumsal sitesinin statik yeniden yapımı.
TR + EN, tek sayfa (anchor nav), GitHub Pages'te yayınlanır.

## Tasarım otoritesi
- **DESİL tek tasarım otoritesidir** (`../_ref-desil` front-end katmanı). Token mimarisi,
  fluid `clamp()` ölçekleri, 8/4px spacing, radius politikası, BEM komponent dili, buton
  varyantları, kart hover deseni, sticky/transparan header + logo swap, eyebrow deseni,
  IntersectionObserver scroll-reveal ve a11y tabanı desil'den **birebir** taşınır.
- Değişen sadece token DEĞERLERİDİR: **"Antrasit & Bakır"** — antrasit koyu zemin
  (`#17191D` ailesi), bakır/amber vurgu (`#A85A28` / `#E8A455`), sıcak nötr açık zeminler.
  Logodaki turuncu çizgi paletin dayanağıdır.
- **Font kararı (2026-07-28, kullanıcı onaylı):** Manrope (Gavia gövde fontu, SIL OFL)
  benimsendi ve tipografik ölçek Gavia'nın gerçek sistemine uyarlandı (H1 2.7→5rem /
  lh 1.02 / -0.025em; H2 1.875→3rem / 700 / lh 1.25). Queulat ("Quelab") ticari
  lisanslı olduğu için alınamadı; başlık karakteri Manrope 800 ağırlıkla kuruluyor.
  Lisans alınırsa display fontu tek token değişimiyle (`--font-display`) takılabilir.
  Manrope'ta italik yok — vurgu ağırlık kontrastıyla, sentetik eğik YASAK.
- desil'in yapısından sapan yeni düzen/komponent icat edilmez. Yeni bir ihtiyaç çıkarsa
  önce desil'de karşılığı aranır; yoksa kullanıcıya sorulur.

## Teknik çerçeve
- **Build step YOK.** Saf HTML + CSS + vanilla JS. npm, bundler, framework, preprocessor kullanılmaz.
- **Harici bağımlılık YOK:** CDN script/style/font yasak. Fontlar `assets/fonts/` altında
  woff2 self-host. Onaylı iki istisna: iletişim bölümündeki harita iframe'i ve
  (bağlanınca) form servisi endpoint'i.
- Tüm URL/asset yolları **göreli** yazılır (Pages alt dizin uyumu). Kök `/` ile başlayan yol yasak.
- Görseller `assets/img/` altında **WebP**. Kaynak JPG/PNG repo'ya girmez (favicon.ico istisna).
- Görsel kaynağı hedef sitedir. Çözünürlük yetersizse RAPOR edilir; kendi başına harici
  görsel indirilmez.

## ALTIN KURAL
Hiçbir ekranda placeholder, "yakında", lorem ipsum, boş link (`href="#"`) veya disabled
içerik olamaz. Tüm metinler hedef siteden alınmış gerçek içeriktir. Gerçek verisi olmayan
öğe (ör. sosyal medya ikonu) hiç konmaz. **Çalışmayan bir form canlıya çıkmaz** — form
markup'ı yazılır ama `action` form servisine bağlanana dek form sayfada yayınlanmaz;
şüphede kullanıcıya sorulur.

## Onaylı içerik kararları
- **EN metin:** Anlam değiştirmeden gramer/dizgi düzeltilir ("Product Portfolıo" →
  "Product Portfolio"; çelik bilya cümlesi düzgün İngilizce yazılır). Bölüm adları:
  Kurumsal → Corporate, İletişim → Contact, İnşaat → Construction.
- **Form:** Faz 1'de zengin iletişim bloğu (tıklanabilir tel/mailto/adres + harita).
  Form `action` TODO yorumuyla form servisine hazır bırakılır; hesap açılınca tek satır değişir.
- **Sosyal ikon konmaz** (kaynak sitede gerçek URL yok). **Copyright 2026.**
- İletişim: Değirmenbahçe Cad. İstWest Blokları B-Blok K:5 D:59 Yenibosna/İstanbul ·
  +90 212 801 15 49 · info@nazmadencilik.com.tr

## Dizin yapısı
```
index.html            # TR (varsayılan dil, one-page)
en.html               # EN one-page (DOM index.html ile birebir)
kvkk.html             # KVKK Aydınlatma Metni (yasal; hukukçu onayı bekliyor)
gizlilik-politikasi.html
cerez-politikasi.html
kvkk-notice.html      # EN yasal karşılıklar (aynı hukukçu-onayı blokerine tabi)
privacy-policy.html
cookie-policy.html
favicon.ico
assets/
  css/tokens.css      # TEK tasarım otoritesi: @font-face + renk/tip/spacing/radius/shadow/motion token'ları
  css/main.css        # Tüm komponent ve layout stilleri; renk-ölçü değerleri token'lardan
  js/main.js          # Tek IIFE: sticky header, mobil menü, scroll-reveal
  img/                # WebP: logo-*.webp, hero/, corporate/, sectors/
  fonts/              # archivo-var-latin.woff2, archivo-var-latin-ext.woff2
CLAUDE.md
README.md             # (Faz 4)
```

## Kod standartları
- Dosya/görsel adları **kebab-case** İngilizce (`sectors/iron-steel.webp`).
- CSS sınıfları BEM-vari: `.block__element--modifier` desil deseninde (`.btn--primary`,
  `.hero-title`, `.section--dark`).
- Yeni renk/ölçü değeri önce `tokens.css`'e token olarak eklenir; `main.css`'te hard-coded
  **hex yazılmaz**. İstisnalar (desil deseni): koyu zemin üstü `rgba(255,255,255,·)` /
  nötr alfa overlay'leri ve 1px hairline değerleri.
- Radius politikası: pill yok; 4/6/10/12px kademeleri, `50%` sadece gerçek daireler.
- Her etkileşim klavyeyle çalışır; `prefers-reduced-motion`'da animasyon ve smooth-scroll sıfırlanır.
- HTML `lang` doğru (`tr`/`en`); her iki sayfada `hreflang` alternate çifti bulunur (Faz 2).
- Section ID'leri anlamlı: TR `#anasayfa #kurumsal #urunler #faaliyet #iletisim`,
  EN `#home #corporate #products #sectors #contact`.
- TR ve EN sayfalarının DOM yapısı birebir aynı kalır; sadece metin/lang/link değişir.
  Yapısal değişiklik iki dosyaya birden uygulanır.

## Git
- **Conventional Commits, İngilizce:** `feat: add product portfolio accordion`,
  `fix: correct EN hreflang`, `chore: convert sector images to webp`.
- **`git add -A` ve `git add .` YASAK.** Dosyalar her zaman tek tek, isimle stage edilir.
- Commit'ler faz bazlı ve odaklı; ilgisiz değişiklikler aynı commit'e girmez.
- Ana branch: `main`. Doğrudan `main`'e commit edilir (tek geliştirici akışı).
- Commit/push/repo oluşturma yalnızca kullanıcı onayıyla yapılır.

## Açık işler ([BLOKER] işaretliler çözülmeden canlıya çıkılmaz)
- [ ] **Form servisi:** Form yayında DEĞİL — markup `index.html`'de HTML yorumunda
      bekliyor, yerine "Bize Ulaşın" bloğu var (önizleme deploy'u noindex'li). Formspree
      vb. bağlanınca yorum açılır, `action` girilir; `kvkk.html` §5 ve
      `gizlilik-politikasi.html` §3'teki yorumlu bölümler de güncellenir.
- [ ] **[BLOKER] Patron künye bilgileri:** `kvkk.html`'deki `[[PATRON ONAYI BEKLİYOR]]`
      alanları — Vergi Kimlik No, MERSİS No, KEP adresi. Sahte değer YAZILMAZ.
- [ ] **[BLOKER] Hukukçu onayı:** `kvkk.html`, `gizlilik-politikasi.html`,
      `cerez-politikasi.html` standart şablondur; hukukçu onayından geçmeden yayınlanmaz
      (her dosyanın başında HTML yorumu olarak da işaretli).
- [ ] **Ürün fotoğrafları:** Ürün Portföyü panellerindeki soyut SVG'ler dekoratif vekildir;
      gerçek ürün fotoğrafı gelirse ilgili `.acc-media` içeriği tek `<img>` ile değişir.
- [x] **Sektör fotoğrafları:** Kullanıcı talimatıyla (2026-07-28) 8 sektör Unsplash
      ÜCRETSİZ lisanslı 1920px stok fotoğraflarla değiştirildi (premium/filigranlı
      sonuçlar elendi; lisans: ticari kullanım serbest, atıf zorunlu değil).
      Patrondan gerçek saha fotoğrafları gelirse aynı adlarla değiştirilebilir.
- [ ] **Kimyasal listesi kırpımı:** Ürün kartlarında eşit yükseklik için açıklamalar
      4 satıra sabitlendi (kullanıcı talebi); Kimyasal Maddeler listesinin kuyruğu
      kartta görünmüyor (tam liste title'da). Canlı öncesi karar: kırpım kalsın mı,
      tam liste başka yerde mi gösterilsin.
- [ ] **Deneyim yılı rozeti:** Kurumsal galerisindeki rozet şimdilik gerçek "3 Kıtada
      Pazar Ağı" değerini taşıyor; "X yıllık" tarzı deneyim rakamı KAYNAKTA YOK ve
      uydurulamaz — patrondan kuruluş yılı/deneyim rakamı gelince tek satırda değişir.
- [ ] **Vektör logo:** kaynak 160×100 PNG retinada yumuşak; SVG patrondan beklemede.
      Geldiğinde sayfalarda yalnız `src` değişecek (kutu oran-bağımsız).
- [x] **EN sayfası (Faz 2):** Bitti (2026-07-28) — `en.html` + EN yasal sayfalar
      (`kvkk-notice.html`, `privacy-policy.html`, `cookie-policy.html`); hreflang
      alternate çiftleri 8 sayfada (göreli URL; Faz 3'te mutlak URL'ye çevrilecek);
      çerez bandı `html[lang]`'e göre TR/EN. Dil seçici her sayfada kendi
      karşılığına gider.
- [ ] **Faz 3:** SEO/OG meta seti, og-image, Lighthouse turu, a11y turu; yasal sayfalardaki
      `noindex` yayın öncesi gözden geçirilecek.
- [ ] **Faz 4:** GitHub repo + Pages aktivasyonu + README.

## Deploy
1. Değişiklikler `main`'e push edilir.
2. GitHub Pages: Settings → Pages → Source: `main` / root. Yayın otomatiktir.
3. Push sonrası canlı URL'de doğrulama: her iki dil, mobil genişlik, konsol hatasız.
4. Custom domain bağlanacaksa: `CNAME` dosyası + DNS A/ALIAS kaydı; göreli yol disiplini
   sayesinde başka değişiklik gerekmez.
