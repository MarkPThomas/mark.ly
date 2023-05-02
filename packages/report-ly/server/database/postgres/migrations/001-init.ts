
// TODO: Needs user table for page table
// TODO: See about decoupling report_trip from page table. Maintain association a different way.
//    Maybe also for album, photo, video (media service?) & reference (data service?)

export class Init001 {
  public async up(client): Promise<void> {
    // Common
    // Enums
    await client.query(
      `CREATE TABLE "status" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "status_name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY("id")
      )`
    );

    // Media
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
        "book_author" varchar(500) DEFAULT NULL COMMENT 'Format is [{lastName, firstName}; {lastName, firstName}]...',
        "book_URL" varchar(500) DEFAULT NULL COMMENT 'For book purchase\n',
        "status_id" int(11) NOT NULL DEFAULT '1',
        "private_file_URL" varchar(500) DEFAULT NULL COMMENT 'URL_private field used as the entry can be public, but a link may be provided to a private PDF or other file originally online that is meant to be used for private reference only\n',
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
      `CREATE TABLE "page" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title_menu" varchar(90) NOT NULL,
        "title_full" varchar(500) NOT NULL,
        "description" text NOT NULL,
        "photo_id" int(11) DEFAULT NULL,
        "url" text,
        "date_created" datetime DEFAULT NULL,
        "date_modified" datetime DEFAULT NULL,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "page_tasks" text,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "views_count" int(11) NOT NULL DEFAULT '0',
        "user_id" int(11) NOT NULL DEFAULT '1',
        PRIMARY KEY ("id"),
        KEY "fk_pages_status1_idx" ("status_id"),
        KEY "fk_page_photo1_idx" ("photo_id"),
        KEY "fk_page_user1_idx" ("user_id"),
        CONSTRAINT "fk_page_photo1"
          FOREIGN KEY ("photo_id")
          REFERENCES "photo" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_page_user1"
          FOREIGN KEY ("user_id")
          REFERENCES "user" ("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "fk_pages_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=1023`
    );


    // Core
    await client.query(
      `CREATE TABLE IF NOT EXISTS "report_photo" (
        "report_photo_id" int(11) NOT NULL AUTO_INCREMENT,
        "photo_id" int(11) NOT NULL,
        "suppress_caption" tinyint(1) NOT NULL DEFAULT '1',
        "custom_caption" text,
        PRIMARY KEY ("report_photo_id"),
        KEY "fk_report_photos_photos1_idx" ("photo_id"),
        CONSTRAINT "fk_report_photos_photos1"
          FOREIGN KEY ("photo_id")
          REFERENCES "photo" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=31678`
    );

    await client.query(
      `CREATE TABLE "report_video" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "video_id" int(11) NOT NULL,
        "suppress_caption" tinyint(1) NOT NULL DEFAULT '1',
        "custom_caption" text,
        PRIMARY KEY("id"),
        KEY "fk_report_videos_videos1_idx" ("video_id"),
        CONSTRAINT "fk_report_videos_videos1"
          FOREIGN KEY ("video_id")
          REFERENCES "video" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=250`
    );

    // Enums
    await client.query(
      `CREATE TABLE "report_trip_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(100) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY("id")
      ) AUTO_INCREMENT=5`
    );

    await client.query(
      `CREATE TABLE "header_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    // Other
    await client.query(
      `CREATE TABLE "page" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title_menu" varchar(90) NOT NULL,
        "title_full" varchar(500) NOT NULL,
        "description" text NOT NULL,
        "photo_id" int(11) DEFAULT NULL,
        "url" text,
        "date_created" datetime DEFAULT NULL,
        "date_modified" datetime DEFAULT NULL,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "page_tasks" text,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "views_count" int(11) NOT NULL DEFAULT '0',
        "user_id" int(11) NOT NULL DEFAULT '1',
        PRIMARY KEY ("id"),
        KEY "fk_pages_status1_idx" ("status_id"),
        KEY "fk_page_photo1_idx" ("photo_id"),
        KEY "fk_page_user1_idx" ("user_id"),
        CONSTRAINT "fk_page_photo1" FOREIGN KEY ("photo_id") REFERENCES "photo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_page_user1" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "fk_pages_status1" FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      ) AUTO_INCREMENT=1023`
    );

    // Views
    // await client.query(
    //   `VIEW "report_trip_body_view" AS
    //   select
    //     "b"."report_trip_id" AS "report_trip_id",
    //     "b"."sequence" AS "sequence",
    //     "header"."name" AS "header_name",
    //     "b"."header" AS "header",
    //     "b"."text_body" AS "text_body",
    //     "rp"."suppress_caption" AS "photo_suppress_caption",
    //     "rp"."custom_caption" AS "photo_custom_caption",
    //     "p"."album_id" AS "photo_album_id",
    //     "p"."url" AS "photo_url",
    //     "p"."width" AS "photo_width",
    //     "p"."height" AS "photo_height",
    //     "p"."caption" AS "photo_caption",
    //     "p"."latitude" AS "photo_latitude",
    //     "p"."longitude" AS "photo_longitude",
    //     "p"."time_stamp" AS "photo_time_stamp",
    //     "p"."is_public" AS "photo_is_public",
    //     "rv"."suppress_caption" AS "video_suppress_caption",
    //     "rv"."custom_caption" AS "video_custom_caption",
    //     "v"."photo_album_id" AS "video_album_id",
    //     "v"."url" AS "video_url",
    //     "v"."orientation_landscape" AS "video_orientation_landscape",
    //     "v"."caption" AS "video_caption",
    //     "v"."latitude" AS "video_latitude",
    //     "v"."longitude" AS "video_longitude",
    //     "v"."time_stamp" AS "video_time_stamp",
    //     "v"."is_public" AS "video_is_public"
    //   from (
    //     (
    //       (
    //         (
    //           (
    //             "report_trip_body" "b"
    //             left join "header_type" "header"
    //             on (
    //               ("b"."header_type_id" = "header"."id")
    //             )
    //           )
    //           left join "report_photo" "rp"
    //           on (
    //             ("b"."report_photo_id" = "rp"."id")
    //           )
    //         )
    //         left join "photo" "p"
    //         on (
    //           ("rp"."photo_id" = "p"."id")
    //         )
    //       )
    //       left join "report_video" "rv"
    //       on (
    //         ("b"."report_video_id" = "rv"."id")
    //       )
    //     )
    //     left join "video" "v"
    //     on (
    //       ("rv"."video_id" = "v"."id")
    //     )
    //   )
    //   order by "b"."report_trip_id", "b"."sequence"`
    // );
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}