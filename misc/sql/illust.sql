CREATE TABLE IF NOT EXISTS pixiv.illust (
	"id" int4,

	"stat" int4 NOT NULL DEFAULT 0,

	PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_illust_id ON pixiv.illust("id");