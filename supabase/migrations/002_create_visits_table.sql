-- ============================================
-- visits (방문자 로그) 테이블
-- 페이지뷰 추적 + 세션 기반 unique visitor 산출
-- ============================================

CREATE TABLE IF NOT EXISTS seunghyo.visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 조회 성능 인덱스
CREATE INDEX IF NOT EXISTS visits_created_at_idx
  ON seunghyo.visits(created_at DESC);
CREATE INDEX IF NOT EXISTS visits_session_id_idx
  ON seunghyo.visits(session_id);
CREATE INDEX IF NOT EXISTS visits_path_idx
  ON seunghyo.visits(path);

-- RLS: 익명 INSERT 허용, SELECT는 service_role만 (admin API 전용)
ALTER TABLE seunghyo.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "visits_insert" ON seunghyo.visits
  FOR INSERT WITH CHECK (true);

-- 권한 부여
GRANT INSERT ON seunghyo.visits TO anon, authenticated;
GRANT ALL ON seunghyo.visits TO service_role;
