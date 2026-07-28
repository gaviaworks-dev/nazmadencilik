# HANDOFF — Naz Madencilik (2026-07-28)

## Durum

Statik one-page kurumsal site **canlıda (önizleme)**. Build step yok; saf HTML/CSS/JS.

- **Canlı:** https://gaviaworks-dev.github.io/nazmadencilik/
- **Repo:** https://github.com/gaviaworks-dev/nazmadencilik (public, branch: `main`)
- Önizleme koruması: tüm sayfalarda `noindex, nofollow` + `robots.txt` `Disallow: /`
- Lokal çalıştırma: `python3 -m http.server 8080`

## Bitmiş işler

- Hero (perde/curtain geçişli) · Kurumsal (galeri + lightbox + rozet) · Ürün Portföyü
  (Gavia hizmet kartları) · Faaliyet Alanları (tam ekran sahne, tıklamayla crossfade
  arka plan, tek-sütun adımlı slider) · İletişim (ikonlu tekil erişim kartları + ince
  harita şeridi) · Footer · 3 yasal sayfa (fotoğraflı banner)
- Saydam tema-duyarlı header + topbar; TR|EN dil seçici header'da; "Teklif Alın"
  topbar'da metin-link
- 5 bölüm tam 100svh eşit, içerik dikey merkezli; `y mandatory` sert snap iki yönde
  Playwright ile doğrulandı (900→1800→2700→3699→dip; yukarı 0'a temiz)
- Görseller: 8 sektör Unsplash ÜCRETSİZ lisanslı 1920px stok (premium/filigranlı
  elendi; 900px hücre + 1920px sahne çifti); çerez bilgilendirme bandı (localStorage)
- Deploy: GitHub Pages (main/root); canlı doğrulama süiti geçti (34/34 asset 200,
  konsol 0 hata)

## Kalan işler (öncelik sırasıyla)

1. **en.html** — SIRADAKİ OTURUMUN İLK ADIMI (aşağıya bak)
2. EN yasal sayfalar (kvkk/gizlilik/çerez EN karşılıkları)
3. Form servisi (form markup'ı `index.html`'de HTML yorumunda hazır; Formspree vb.
   bağlanınca yorum açılır + `action` girilir + kvkk §5 / gizlilik §3 güncellenir)
4. Hukukçu onayı (3 yasal metin taslak; sayfa başlarındaki HTML yorumları işaretli)
5. Patron künye bilgileri (kvkk: VKN / MERSİS / KEP — ekranda "—", yorumda işaretli)
6. Vektör (SVG) logo (kutu oran-bağımsız; yalnız `src` değişecek)
7. SEO/OG meta + og-image, Lighthouse + a11y turu (Faz 3)
8. Yayına açılış: `noindex` meta'ları + `robots.txt` kaldır
9. (Opsiyonel) Patrondan gerçek saha fotoğrafları gelirse `assets/img/sectors/`
   aynı adlarla değiştirilebilir; display fontu kararı (aşağıda)

## Font kararı ve gerekçesi (NİHAİ — kullanıcı onaylı)

Manrope (Gavia gövde fontu, SIL OFL) benimsendi; Archivo'ya dönüş YOK. Tipografik
SİSTEM de Gavia'nın gerçeğinden uyarlandı (brand.css + utility sınıfları):
H1 `clamp(2.7rem→5rem)` / lh 1.02 / tracking -0.025em; H2 `clamp(1.875→3rem)` /
700 / lh 1.25; H3 1.25rem; eyebrow 11px/600/0.14em; başlık:gövde ≈3×.
Queulat ("Quelab", Latinotype) ticari lisanslı olduğu için alınamadı; başlık
karakteri Manrope 800 ağırlıkla kuruluyor. Lisans alınırsa display fontu tek token
değişimiyle (`--font-display`) takılabilir. Manrope'ta italik kesim yok — başlık
vurgusu ağırlık kontrastı (`--fw-light`), sentetik eğik kullanılmaz.

## Mimari kararlar (bunları bilmeden dokunma)

- **Sticky eleman snap hedefi OLAMAZ:** sticky kutu scroll'la kaydığı için
  `scroll-snap-align` hedefi kendine referans olur (yukarı yönde kilit yaratmıştı).
  Çözüm: hero, akışta yer tutan `.hero-slot` sarmalayıcısında; snap ve `#anasayfa`
  anchor'ı SLOT'ta. Perde (`.hero--curtain`) sticky çocuktur.
- **`visibility: hidden` snap alanını SİLER:** örtülen hero'yu gizlemek için
  kullanılmıştı, snap noktasını da yok etti. Çözüm: `inert` (odak/etkileşim kesilir,
  layout ve snap alanı kalır). Görsel örtmeyi opak Kurumsal (`section--white`) yapar.
- **`y mandatory` güvenliği:** TÜM ana bölümler `snap-align: start` + footer `end`.
  Viewport'tan uzun bölüm spec'in "alan snapport'u kaplıyorsa serbest" kuralıyla
  hapsetmez. Bölümler tam 100svh eşit olduğu sürece "tık tık" his garantili.
- **Header data-theme mekanizması:** her üst blok `data-theme="light|dark"` taşır.
  `main.js`'te `syncHeaderTheme()` header bandının ~0.6 yüksekliğindeki sondada
  kesişen bölümlerden **DOM'da en sonuncusunu** seçer (perde yüzünden sticky hero
  hep kesişir; boyanma sırasında sonraki bölüm üstte olduğundan SON eşleşen kazanır —
  `break` koyma, eski bug buydu). IO (`rootMargin: 0 0 -85%`) tetikler + her
  scroll'da ucuz doğrulama. Sınıflar: `.theme-light/.theme-dark` yalnız `is-stuck`
  görselini değiştirir; tepede saf saydam.
- Diğer: `body{overflow-x:clip}` (hidden OLMAZ — hem sticky hem kök snap kırılır);
  `--topbar-h`/`--header-h` JS ölçümlü token; sahne görselleri `-2x` set kullanır,
  hücreler 1x; tüm yollar GÖRELİ (Pages alt dizini).

## Sıradaki oturumun ilk adımı: en.html

- `index.html` DOM'u BİREBİR kopyalanır (CLAUDE.md kuralı), yalnız metin/lang/link
  değişir: `lang="en"`, section ID'leri `#home #corporate #products #sectors #contact`,
  nav/başlık/içerik EN (onaylı karar: kaynak EN metin gramer/dizgi düzeltilerek —
  "Product Portfolio", Çelik Bilya cümlesi düzgün İngilizce; Kurumsal→Corporate,
  İletişim→Contact, İnşaat→Construction).
- Dil seçici: EN sayfada TR pasif→`index.html`, EN aktif; `hreflang` alternate
  çifti HER İKİ sayfaya eklenir; `og:locale` uyumu.
- Topbar CTA `#contact`'a; yasal sayfa linkleri şimdilik TR sayfalara (EN yasal
  sayfalar 2. adım).
- Kaynak EN metinleri: eski site `en.html` (keşif dökümü bu repoda değil; canlıdan
  `https://nazmadencilik.com.tr/en.html` tekrar çekilebilir).

## Test altyapısı

Playwright (scratchpad `pwtest/`, `playwright-core` + sistem Chrome `channel`):
`uiux-test.mjs` (eşitlik+snap), `live-test.mjs` (canlı tam süit). Headless
sınırları: sanal zamanda CSS transition'lar ilerlemez, scroll EVENT'leri düşmez —
davranış testinde gerçek `mouse.wheel` kullan.
