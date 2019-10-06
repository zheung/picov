CREATE TABLE IF NOT EXISTS exhentai.gallery (
	"id" int4 NOT NULL,
	"token" varchar(255) NOT NULL,

	"title" varchar(255) NOT NULL,
	"titleJapan" varchar(255),

	"category" int2 NOT NULL,

	"language" varchar(255) NOT NULL,
	"isTranslated" bool NOT NULL DEFAULT FALSE,

	"fileSize" float4 NOT NULL,
	"fileCount" int2 NOT NULL,

	"tagLang" varchar(255)[] NOT NULL,
	"tagParody" varchar(255)[] NOT NULL,
	"tagCharacter" varchar(255)[] NOT NULL,
	"tagGroup" varchar(255)[] NOT NULL,
	"tagArtist" varchar(255)[] NOT NULL,
	"tagFemale" varchar(255)[] NOT NULL,
	"tagMale" varchar(255)[] NOT NULL,
	"tagMisc" varchar(255)[] NOT NULL,
	"tagReclass" varchar(255)[] NOT NULL,

	"timePost" timestamp NOT NULL,

	"archiverKey" varchar(255),

	PRIMARY KEY ("id", "token")
);