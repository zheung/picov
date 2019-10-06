CREATE TABLE IF NOT EXISTS pixiv.userHistory (
	"user" int4,

	"account" varchar(255) NOT NULL DEFAULT 0,
	"name" varchar(255) NOT NULL DEFAULT 0,
	"header" varchar(255) NOT NULL DEFAULT 0,
	"comment" text,

	"timeInsert" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
);