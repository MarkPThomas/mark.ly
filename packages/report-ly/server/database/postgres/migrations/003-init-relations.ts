export class InitRelations003 {
  public async up(client): Promise<void> {
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