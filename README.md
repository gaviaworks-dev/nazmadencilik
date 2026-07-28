# Naz Madencilik — Kurumsal Site

[Naz Madencilik](https://nazmadencilik.com.tr) kurumsal sitesinin statik yeniden yapımı.
Tek sayfa (anchor navigasyon), TR (EN Faz 2'de), tasarım dili: **Antrasit & Bakır**.

> **Önizleme durumu:** Bu deploy bir önizlemedir — tüm sayfalar `noindex, nofollow`
> taşır ve `robots.txt` tüm botları engeller. Yasal metinler taslaktır.

**Canlı önizleme:** https://gaviaworks-dev.github.io/nazmadencilik/

## Çalıştırma

Build adımı yok — saf HTML/CSS/JS. Herhangi bir statik sunucu yeterli:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Dizin yapısı

```
index.html                  # TR one-page (hero, kurumsal, ürünler, faaliyet, iletişim)
kvkk.html                   # KVKK Aydınlatma Metni (TASLAK)
gizlilik-politikasi.html    # Gizlilik Politikası (TASLAK)
cerez-politikasi.html       # Çerez Politikası (TASLAK)
robots.txt                  # Önizleme: tüm botlara kapalı
favicon.ico
assets/
  css/tokens.css            # Tek tasarım otoritesi: @font-face + tüm token'lar
  css/main.css              # Komponent ve layout stilleri
  js/main.js                # Tek IIFE: header teması, perde, slider, galeri, snap yardımcıları
  img/                      # WebP görseller (hero/, corporate/, sectors/ + 2x sahne seti)
  fonts/                    # Archivo değişken font (normal + italik, latin + latin-ext)
tasks/ROADMAP.md            # İş kuyruğu
CLAUDE.md                   # Proje kuralları ve açık işler
```

## Açık işler (özet — ayrıntı `CLAUDE.md`)

- **Form servisi:** iletişim formu markup'ı yorumda bekliyor; servis bağlanınca açılacak.
- **Yasal metinler:** hukukçu onayı + künye alanları (VKN/MERSİS/KEP) patrondan.
- **Görseller:** 8 sektör için min 1920px gerçek fotoğraf; kurumsal galeri kareleri;
  vektör (SVG) logo.
- **Faz 2:** EN sayfası + EN yasal sayfalar. **Faz 3:** SEO/OG, Lighthouse, a11y turu
  (yayına açılırken `noindex`/`robots.txt` kaldırılacak).
