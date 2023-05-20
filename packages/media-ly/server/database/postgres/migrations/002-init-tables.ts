export class InitTables002 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "photo_album" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "url" varchar(500) NOT NULL,
        "title" varchar(500) NOT NULL,
        "summary" text NOT NULL,
        "latitude" float DEFAULT NULL,
        "longitude" float DEFAULT NULL,
        "date" date DEFAULT NULL,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "captions_status_id" int(11) NOT NULL DEFAULT '1',
        "geotag_status_id" int(11) NOT NULL DEFAULT '1',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "url_piwigo" varchar(500) DEFAULT NULL,
        "url_picasa" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "title_UNIQUE" ("title"(100)),
        KEY "fk_photo_albums_status1_idx" ("status_id"),
        KEY "fk_photo_albums_status2_idx" ("captions_status_id"),
        KEY "fk_photo_albums_status3_idx" ("geotag_status_id"),
        CONSTRAINT "fk_photo_albums_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_photo_albums_status2"
          FOREIGN KEY ("captions_status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_photo_albums_status3"
          FOREIGN KEY ("geotag_status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=285`
    );

    await client.query(
      `CREATE TABLE "photo" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "album_id" int(11) DEFAULT NULL,
        "url" varchar(500) NOT NULL,
        "caption" text,
        "width" smallint(9) DEFAULT NULL,
        "height" smallint(9) DEFAULT NULL,
        "latitude" float DEFAULT NULL,
        "longitude" float DEFAULT NULL,
        "time_stamp" datetime DEFAULT NULL,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "file_name" varchar(255) DEFAULT NULL,
        "url_piwigo" varchar(500) DEFAULT NULL,
        "url_picasa" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_photos_photo_albums1_idx" ("album_id"),
        CONSTRAINT "fk_photos_photo_albums1"
          FOREIGN KEY ("album_id")
          REFERENCES "photo_album" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=31334`
    );

    await client.query(
      `CREATE TABLE "video" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "photo_album_id" int(11) DEFAULT NULL,
        "url" varchar(500) NOT NULL,
        "orientation_landscape" tinyint(1) DEFAULT NULL,
        "caption" text,
        "latitude" float DEFAULT NULL,
        "longitude" float DEFAULT NULL,
        "time_stamp" datetime DEFAULT NULL,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "id_youtube" varchar(50) DEFAULT NULL,
        "id_vimeo" varchar(50) DEFAULT NULL,
        "url_piwigo" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_photos_photo_albums1_idx" ("photo_album_id"),
        CONSTRAINT "fk_photos_photo_albums10"
          FOREIGN KEY ("photo_album_id")
          REFERENCES "photo_album" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )  AUTO_INCREMENT=247`
    );

    await client.query(
      `CREATE TABLE "reference" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(200) NOT NULL,
        "description" text,
        "website_URL" varchar(500) DEFAULT NULL,
        "book_title" varchar(200) DEFAULT NULL,
        "book_author" varchar(500) DEFAULT NULL
          COMMENT 'Format is [{lastName, firstName}; {lastName, firstName}]...',
        "book_URL" varchar(500) DEFAULT NULL
          COMMENT 'For book purchase\n',
        "status_id" int(11) NOT NULL DEFAULT '1',
        "private_file_URL" varchar(500) DEFAULT NULL
          COMMENT 'URL_private field used as the entry can be public, but a link may be provided to a private PDF or other file originally online that is meant to be used for private reference only\n',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        KEY "fk_references_offline_status1_idx" ("status_id"),
        CONSTRAINT "fk_references_offline_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=447`
    );

    await client.query(
      ``
    );

    await client.query(
      ``
    );

    await client.query(
      ``
    );

    await client.query(
      ``
    );
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}