export class InitTables002 {
  public async up(client): Promise<void> {
    // photo
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

    // video
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

    await client.query(
      `CREATE TABLE "report_trip" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" int(11) DEFAULT NULL,
        "status_id" int(11) NOT NULL DEFAULT '2',
        "report_trip_type_id" int(11) NOT NULL DEFAULT '3',
        PRIMARY KEY ("id"),
        KEY "fk_trip_reports_pages1_idx" ("page_id"),
        KEY "fk_report_trip_status1_idx" ("status_id"),
        KEY "fk_report_trip_report_trip_type1_idx" ("report_trip_type_id"),
        CONSTRAINT "fk_report_trip_report_trip_type1"
          FOREIGN KEY ("report_trip_type_id")
          REFERENCES "report_trip_type" ("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "fk_report_trip_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_reports_pages1"
          FOREIGN KEY ("page_id")
          REFERENCES "page" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=1022`
    );

    await client.query(
      `CREATE TABLE "report_trip_body" (
        "id" int(11) NOT NULL,
        "report_trip_id" int(11) NOT NULL,
        "sequence" int(11) NOT NULL,
        "header_type_id" int(11) DEFAULT NULL,
        "header" varchar(500) DEFAULT NULL,
        "text_body" text,
        "report_photo_id" int(11) DEFAULT NULL,
        "report_video_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "sequence_idx" ("report_trip_id", "sequence"),
        KEY "fk_report_trip_bodies_report_photos1_idx" ("report_photo_id"),
        KEY "fk_report_trip_bodies_report_videos1_idx" ("report_video_id"),
        KEY "fk_report_trip_bodies_report_trips1_idx" ("report_trip_id"),
        KEY "fk_report_trip_bodies_header_types1_idx" ("header_type_id"),
        CONSTRAINT "fk_report_trip_bodies_header_types1"
          FOREIGN KEY ("header_type_id")
          REFERENCES "header_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_report_trip_bodies_report_photos1"
          FOREIGN KEY ("report_photo_id")
          REFERENCES "report_photo" ("report_photo_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_report_trip_bodies_report_trips1"
          FOREIGN KEY ("report_trip_id")
          REFERENCES "report_trip" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_report_trip_bodies_report_videos1"
          FOREIGN KEY ("report_video_id")
          REFERENCES "report_video" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=34331`
    );
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}