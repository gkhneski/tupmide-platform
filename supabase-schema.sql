-- Tüp Mide Multitenant Klinik Platformu – Supabase Şema

-- UUID extension
create extension if not exists "uuid-ossp";

-- 1) Clinics
create table if not exists clinics (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  phone text,
  city text,
  country text,
  created_at timestamp with time zone default now()
);

-- 2) Doctors
create table if not exists doctors (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete set null,
  name text,
  email text,
  is_clinic_admin boolean default false,
  created_at timestamp with time zone default now()
);

-- 3) Assistants (hemşire, diyetisyen, psikolog)
create table if not exists assistants (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete set null,
  name text,
  email text,
  role text check (role in ('nurse', 'dietician', 'psychologist')),
  created_at timestamp with time zone default now()
);

-- 4) Patients
create table if not exists patients (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete set null,
  doctor_id uuid references doctors(id) on delete set null,
  full_name text,
  gender text check (gender in ('male', 'female', 'other')),
  birthdate date,
  phone text,
  email text,
  height_cm int,
  start_weight_kg numeric,
  surgery_type text, -- sleeve, bypass, vb.
  surgery_date date,
  has_diabetes boolean default false,
  has_hypertension boolean default false,
  has_sleep_apnea boolean default false,
  has_reflux boolean default false,
  notes text,
  created_at timestamp with time zone default now()
);

-- 5) Measurements
create table if not exists measurements (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete cascade,
  record_date date default current_date,
  weight_kg numeric,
  waist_cm numeric,
  water_ml int,
  protein_g int,
  steps int,
  calories int,
  nausea boolean default false,
  vomiting boolean default false,
  reflux_symptom boolean default false,
  hair_loss boolean default false,
  note text,
  created_at timestamp with time zone default now()
);

-- 6) Lab results (kan tahlilleri)
create table if not exists lab_results (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete cascade,
  file_url text,
  test_date date,
  title text,
  short_summary text,
  created_at timestamp with time zone default now()
);

-- 7) Messages (chat)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  receiver_id uuid references auth.users(id),
  patient_id uuid references patients(id),
  message text,
  created_at timestamp with time zone default now()
);

-- 8) Tasks (görevler)
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  patient_id uuid references patients(id) on delete cascade,
  created_by uuid references auth.users(id),
  title text,
  description text,
  due_date date,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- RLS Aktifleştir
alter table clinics enable row level security;
alter table doctors enable row level security;
alter table assistants enable row level security;
alter table patients enable row level security;
alter table measurements enable row level security;
alter table lab_results enable row level security;
alter table messages enable row level security;
alter table tasks enable row level security;

-- ÖRNEK BASİT RLS (detaylı prod kuralları ayrıca yazılmalı)

-- Hasta kendi patient kaydını görebilsin
create policy "patient_select_self"
on patients
for select
using ( auth.uid() = id );

-- Doktor kendi klinik hastalarını görebilsin (basit örnek)
create policy "doctor_select_own_clinic_patients"
on patients
for select
using (
  exists (
    select 1
    from doctors d
    where d.id = auth.uid()
      and d.clinic_id = patients.clinic_id
  )
);

-- Ölçümler: hasta kendi ölçümlerini görebilsin
create policy "patient_select_own_measurements"
on measurements
for select
using (
  exists (
    select 1
    from patients p
    where p.id = measurements.patient_id
      and p.id = auth.uid()
  )
);

-- Ölçümler: doktor kendi klinik hastalarının ölçümlerini görebilsin
create policy "doctor_select_clinic_measurements"
on measurements
for select
using (
  exists (
    select 1
    from doctors d
    join patients p on p.clinic_id = d.clinic_id and p.id = measurements.patient_id
    where d.id = auth.uid()
  )
);

-- NOT:
-- Gerçek projede role bazlı daha detaylı policy'ler eklenmeli
-- (assistant rolleri, super_admin istisnaları, vs.)
