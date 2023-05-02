export class InitMain002 {
  public async up(client): Promise<void> {
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

    // Many-to-many
    await client.query(
      `CREATE TABLE "report_trip_has_photo_album" (
        "report_trip_id" int(11) NOT NULL,
        "photo_album_id" int(11) NOT NULL,
        PRIMARY KEY ("report_trip_id", "photo_album_id"),
        KEY "fk_report_trips_has_photo_albums_photo_albums1_idx" ("photo_album_id"),
        KEY "fk_report_trips_has_photo_albums_report_trips1_idx" ("report_trip_id"),
        CONSTRAINT "fk_report_trips_has_photo_albums_photo_albums1"
          FOREIGN KEY ("photo_album_id")
          REFERENCES "photo_album" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_report_trips_has_photo_albums_report_trips1"
          FOREIGN KEY ("report_trip_id")
          REFERENCES "report_trip" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "report_trip_has_reference" (
        "report_trip_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("report_trip_id", "reference_id"),
        KEY "fk_report_trip_has_reference_reference1_idx" ("reference_id"),
        KEY "fk_report_trip_has_reference_report_trip1_idx" ("report_trip_id"),
        CONSTRAINT "fk_report_trip_has_reference_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "fk_report_trip_has_reference_report_trip1"
          FOREIGN KEY ("report_trip_id")
          REFERENCES "report_trip" ("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )`
    );
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}