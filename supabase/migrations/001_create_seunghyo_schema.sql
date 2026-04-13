-- ============================================
-- seunghyo schema 생성
-- 서울시의회 동대문구 제2선거구 이승효 후보
-- ============================================

-- 1. Schema 생성
CREATE SCHEMA IF NOT EXISTS seunghyo;

-- 2. cheers (응원 메시지)
CREATE TABLE seunghyo.cheers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. opinions (주민 의견)
CREATE TABLE seunghyo.opinions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. donations (후원금 입금정보)
CREATE TABLE seunghyo.donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  resident_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  postal_code TEXT,
  address TEXT NOT NULL,
  detail_address TEXT,
  email TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  amount INTEGER NOT NULL,
  deposit_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================

ALTER TABLE seunghyo.cheers ENABLE ROW LEVEL SECURITY;
ALTER TABLE seunghyo.opinions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seunghyo.donations ENABLE ROW LEVEL SECURITY;

-- cheers: 누구나 읽기/쓰기
CREATE POLICY "cheers_select" ON seunghyo.cheers FOR SELECT USING (true);
CREATE POLICY "cheers_insert" ON seunghyo.cheers FOR INSERT WITH CHECK (true);

-- opinions: 누구나 읽기/쓰기
CREATE POLICY "opinions_insert" ON seunghyo.opinions FOR INSERT WITH CHECK (true);
CREATE POLICY "opinions_select" ON seunghyo.opinions FOR SELECT USING (true);

-- donations: 누구나 쓰기
CREATE POLICY "donations_insert" ON seunghyo.donations FOR INSERT WITH CHECK (true);

-- ============================================
-- 권한 설정
-- ============================================

-- anon / authenticated 역할에 schema 사용 권한
GRANT USAGE ON SCHEMA seunghyo TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA seunghyo TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA seunghyo
  GRANT ALL ON TABLES TO anon, authenticated;

-- service_role 전체 접근 (관리자 API용)
GRANT ALL ON SCHEMA seunghyo TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA seunghyo TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA seunghyo
  GRANT ALL ON TABLES TO service_role;
