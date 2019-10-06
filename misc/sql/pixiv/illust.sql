CREATE TABLE IF NOT EXISTS pixiv.illust (
	"id" int4,

	"title" varchar(255),
	"user" int4,
	"stat" int4 NOT NULL DEFAULT 0,
	"tags" varchar(255)[],
	"comment" text,

	"timeUpload" timestamp,

	PRIMARY KEY (id)
);

CREATE UNIQUE INDEX index_illust_id ON pixiv.illust("id");