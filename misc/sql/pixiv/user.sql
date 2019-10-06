CREATE TABLE IF NOT EXISTS pixiv.user (
	"id" int4,

	"account" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"header" varchar(255) NOT NULL,
	"comment" text,

	"timeJoin" timestamp NOT NULL,

	PRIMARY KEY (id)
);