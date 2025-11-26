# Tüp Mide Klinik Platformu – Starter (Next.js + Supabase)

Bu proje, tüp mide / bariatrik cerrahi klinikleri için **multitenant** (çok klinikli) SaaS yapısının temel iskeletidir.

## Teknoloji Stack
- Next.js 14 (App Router)
- React 18
- Supabase (Postgres + Auth + Storage)
- Vercel (deploy için)

## Klasör Yapısı (kısa)
- `app/`
  - `(public)/login` – Giriş ekranı (placeholder)
  - `(protected)/admin/dashboard` – Süper admin paneli (sen)
  - `(protected)/clinic/dashboard` – Klinik / Doktor paneli
  - `(protected)/patient/dashboard` – Hasta paneli
- `lib/supabaseClient.js` – Supabase client
- `supabase-schema.sql` – Tüm tablolar + temel RLS örnekleri

## Kurulum (lokal)
```bash
cp .env.example .env.local   # env doldur
npm install
npm run dev
```

## Supabase tarafı
1. Supabase projesi aç.
2. `supabase-schema.sql` içeriğini Supabase SQL editor'e yapıştır ve çalıştır.
3. Auth ayarlarını (e-mail login) aç.
4. RLS kurallarını ihtiyacına göre genişlet.

## Vercel Deploy
- Repo'yu GitHub/GitLab'a push et.
- Vercel'e bağla, environment variable'ları ekle.
- Deploy et.

Bu sadece **başlangıç iskeleti**. Üstüne:
- Gerçek login/logout akışı
- Rol yönetimi (super_admin / clinic_admin / doctor / assistant / patient)
- Detaylı UI ve grafikler
- Bildirimler, SMS, ödeme
ekleyebilirsin.
