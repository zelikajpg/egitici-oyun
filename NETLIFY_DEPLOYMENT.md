# 🚀 NETLIFY İLE DEPLOYMENT REHBERİ

## Oyununuzu 5 Dakikada Yayınlayın!

Bu rehber ile oyununuz **https://sizin-oyununuz.netlify.app** gibi bir adreste **herkese açık** olacak!

---

## 📋 GEREKLİLER

- ✅ GitHub hesabı
- ✅ Google AI Studio API Key
- ✅ Proje dosyaları

---

## ADIM 1: GITHUB'A YÜKLEME (5 dakika)

### 1.1 GitHub'da Yeni Repository Oluşturun

1. **https://github.com** adresine gidin
2. Sağ üstte **"+"** → **"New repository"** tıklayın
3. **Repository ayarları:**
   - **Repository name:** `egitici-oyun`
   - **Description:** "5-6 yaş grubu için AI destekli eğitici oyun platformu"
   - **Public** seçin ✅
   - **Initialize with README** işaretlemeyin ❌
4. **"Create repository"** tıklayın

### 1.2 Dosyaları Yükleyin

**Yöntem 1: Web Arayüzü (Kolay)**

1. Yeni oluşturduğunuz repository sayfasında
2. **"uploading an existing file"** linkine tıklayın
3. **Bu dosyaları sürükleyip bırakın:**
   ```
   ✅ index.html
   ✅ style.css
   ✅ script.js
   ✅ netlify.toml
   ✅ netlify/ klasörünü (functions klasörü içinde)
   ```
4. **Commit message:** "Initial commit"
5. **"Commit changes"** tıklayın

**Yöntem 2: Git ile (Terminal)**

```bash
cd Desktop/egitici-oyun

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/egitici-oyun.git
git push -u origin main
```

---

## ADIM 2: NETLIFY'A BAĞLAMA (2 dakika)

### 2.1 Netlify'a Kaydolun

1. **https://netlify.com** adresine gidin
2. **"Sign up"** tıklayın
3. **"Sign up with GitHub"** seçin
4. GitHub ile giriş yapın ve izin verin

### 2.2 Yeni Site Oluşturun

1. Netlify dashboard'da **"Add new site"** tıklayın
2. **"Import an existing project"** seçin
3. **"Deploy with GitHub"** tıklayın
4. GitHub'da izin verin
5. **Repository seçin:** `egitici-oyun`
6. **Deploy ayarları:**
   - **Branch to deploy:** `main`
   - **Build command:** (boş bırakın)
   - **Publish directory:** `.` (nokta)
7. **"Deploy site"** tıklayın

🎉 **Site deploy ediliyor!** (1-2 dakika sürer)

---

## ADIM 3: API KEY EKLEME (1 dakika)

### 3.1 Environment Variable Ekleyin

1. Netlify dashboard'da sitenize gidin
2. **"Site settings"** tıklayın
3. Sol menüden **"Environment variables"** seçin
4. **"Add a variable"** tıklayın
5. **Bilgileri girin:**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyCr9Kufwiuudp6HRxzoWlwP-u6KUrpyLmA`
   - **Scopes:** Production ✅
6. **"Create variable"** tıklayın

### 3.2 Site'i Yeniden Deploy Edin

1. **"Deploys"** sekmesine gidin
2. **"Trigger deploy"** → **"Clear cache and deploy site"** tıklayın
3. Birkaç dakika bekleyin

---

## ADIM 4: TEST EDİN! 🎮

### 4.1 Sitenize Gidin

1. Netlify dashboard'da **"Open production deploy"** tıklayın
2. Veya sitenizin URL'ini açın (örn: `https://melodic-biscotti-123456.netlify.app`)

### 4.2 Test Checklist

- [ ] Ana menü açılıyor
- [ ] Karakter seçimi çalışıyor
- [ ] Boyama oyunu çalışıyor
- [ ] Hafıza oyunu çalışıyor
- [ ] **AI Hikaye ÜRETİYOR** ⬅️ En önemli!
- [ ] Diğer oyunlar çalışıyor

---

## ADIM 5: ÖZEL DOMAIN (İsteğe Bağlı)

### 5.1 Custom Domain Ekleme

1. **Site settings** → **"Domain management"**
2. **"Add custom domain"** tıklayın
3. Domain adınızı girin (örn: `egitici-oyun.com`)
4. DNS ayarlarını yapın (Netlify size gösterecek)

**Ücretsiz seçenek:**
- Netlify size otomatik `.netlify.app` domain verir
- Örnek: `egitici-oyun-zeliha.netlify.app`

---

## 🎯 LİNKİNİZ HAZIR!

Artık oyununuz yayında! Link'i paylaşabilirsiniz:

```
https://SITE_ADI.netlify.app
```

**Örnek:**
```
https://egitici-oyun.netlify.app
```

---

## 🔧 GÜNCELLEMELERİ NASIL YAPARIM?

### Yöntem 1: GitHub'dan (Otomatik Deploy)

1. Dosyaları düzenleyin
2. GitHub'a yükleyin
3. Netlify **otomatik** günceller!

### Yöntem 2: Git ile

```bash
# Değişiklikleri yap
git add .
git commit -m "Oyun güncellendi"
git push

# Netlify otomatik deploy edecek!
```

---

## 📊 İSTATİSTİKLER

Netlify dashboard'dan:
- 📈 Kaç kişi ziyaret etti
- 🌍 Hangi ülkelerden
- ⚡ Yükleme hızı
- 🔥 Popüler sayfalar

---

## 🐛 SORUN GİDERME

### Sorun 1: Site açılmıyor

**Çözüm:**
1. Netlify → Deploys sekmesine git
2. Son deploy'un durumunu kontrol et
3. Hata varsa log'lara bak

### Sorun 2: AI Hikaye çalışmıyor

**Çözüm:**
1. Environment variable'ı kontrol et
2. `GEMINI_API_KEY` doğru yazıldı mı?
3. API key'i tekrar ekle
4. Site'i yeniden deploy et

### Sorun 3: Functions çalışmıyor

**Çözüm:**
1. `netlify.toml` dosyası var mı?
2. `netlify/functions/` klasörü doğru mu?
3. Dosya adı `generate-story.js` mi?

### Sorun 4: 404 Error

**Çözüm:**
1. Publish directory `.` (nokta) olmalı
2. `index.html` root klasörde mi?
3. Site'i yeniden deploy et

---

## 💡 İPUÇLARI

### Deploy Hızlandırma
- Gereksiz dosyaları `.gitignore`'a ekle
- Görselleri optimize et
- Minimum dosya boyutu

### Güvenlik
- ✅ API key **asla** kodda görünmesin
- ✅ Environment variable kullan
- ✅ HTTPS otomatik aktif (Netlify)

### SEO İyileştirme
- `index.html`'de meta tag'leri güncelle
- Sosyal medya paylaşım görseli ekle
- `sitemap.xml` oluştur

---

## 🎨 CUSTOM DOMAIN İSİMLERİ

Öneriler:
- `egitici-oyun-ai.netlify.app`
- `cocuk-oyunlari-5-6-yas.netlify.app`
- `zeliha-egitici-oyun.netlify.app`

Domain adını değiştirmek için:
1. Site settings → Site details
2. **"Change site name"**
3. Yeni isim gir (küçük harf, tire ile)

---

## 📱 MOBİL UYUMLULUK

Oyun zaten responsive! Test edin:
- 📱 Telefon
- 💻 Tablet
- 🖥️ Masaüstü

Chrome DevTools ile test:
- F12 → Toggle device toolbar
- Farklı ekran boyutları dene

---

## 🚀 GELİŞMİŞ ÖZELLİKLER

### Form Handling
```html
<form netlify>
  <input name="email" type="email">
  <button>Gönder</button>
</form>
```

### Analytics
- Netlify Analytics (ücretli)
- Google Analytics (ücretsiz)

### A/B Testing
- Deploy previews
- Branch deploys

---

## 📞 DESTEK

**Sorun mu var?**

1. **Netlify Docs:** https://docs.netlify.com
2. **Netlify Community:** https://answers.netlify.com
3. **GitHub Issues:** Repository'nizde issue açın

---

## ✅ DEPLOYMENT CHECKLİST

- [ ] GitHub'a yüklendi
- [ ] Netlify'a bağlandı
- [ ] Environment variable eklendi
- [ ] Site deploy edildi
- [ ] AI hikaye test edildi
- [ ] Mobil test edildi
- [ ] Link paylaşıldı

---

## 🎉 TEBRİKLER!

Oyununuz artık canlıda ve **dünya çapında** erişilebilir!

**Paylaş:**
- 🔗 LinkedIn'de
- 📱 Twitter'da
- 📧 Email ile
- 💬 WhatsApp'ta

**Link örneği:**
```
🎮 5-6 yaş için AI destekli eğitici oyun!

Oyun oyna: https://egitici-oyun.netlify.app
GitHub: https://github.com/KULLANICI_ADI/egitici-oyun
```

---

**🚀 Başarılar! Artık bir web developer'sınız! 🚀**

*Son güncelleme: Aralık 2024*
