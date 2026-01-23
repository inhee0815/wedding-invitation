CREATE TABLE IF NOT EXISTS guestbook (
  id TEXT PRIMARY KEY,
  name TEXT,
  message TEXT,
  password TEXT,
  date TEXT
);
CREATE TABLE IF NOT EXISTS app_stats (key TEXT PRIMARY KEY, value INTEGER);
INSERT INTO guestbook
VALUES (
    '1',
    '김철수',
    '결혼 진심으로 축하드립니다! 행복하세요.',
    '1234',
    '2025-12-12'
  );
insert into guestbook
values (
    '2',
    '이미영',
    '너무 아름다운 커플이에요 💕\nSQLite DB 적용 완료!',
    '2025-12-12'
  );
select *
from guestbook