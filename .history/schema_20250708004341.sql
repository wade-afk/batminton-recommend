-- D1 Database 스키마
CREATE TABLE IF NOT EXISTS visitors (
  id INTEGER PRIMARY KEY,
  count INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT OR IGNORE INTO visitors (id, count) VALUES (1, 82267); 