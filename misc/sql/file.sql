CREATE TABLE IF NOT EXISTS pixiv.file (
	"illust" int4 NOT NULL,
	"index" int2 NOT NULL,
	"name" varchar(255) NOT NULL,
	"delay" int2
);

CREATE UNIQUE INDEX idx_file_illust_name ON pixiv.file("illust", "index");