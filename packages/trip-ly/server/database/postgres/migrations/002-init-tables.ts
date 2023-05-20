export class InitTables002 {
  public async up(client): Promise<void> {
    // TODO: Work out partner here vs. climber.ly
    await client.query(
      `CREATE TABLE "partner" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "first_name" varchar(45) NOT NULL,
        "last_name" varchar(45) DEFAULT NULL,
        "notes" text,
        "url_personal" text,
        "url_facebook" text,
        "url_summitpost" text,
        "url_mountainproject" text,
        "url_cascadeclimbers" text,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=151`
    );

    // === Camps & Trailheads ===
    await client.query(
      `CREATE TABLE "camp" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "camp_type_id" int(11) NOT NULL,
        "requires_permit" tinyint(1) NOT NULL DEFAULT '1'
          COMMENT 'Requires a permit or reservation.',
        "has_parking" tinyint(1) DEFAULT NULL,
        "has_water" tinyint(1) DEFAULT NULL,
        "has_restroom" tinyint(1) DEFAULT NULL,
        "tent_capacity" int(11) DEFAULT NULL,
        "gis_marker_route_id" int(11) DEFAULT NULL,
        "gis_marker_route_type_id" int(11) DEFAULT '8',
        PRIMARY KEY ("id"),
        KEY "fk_camp_camp_type1_idx" ("camp_type_id"),
        KEY "fk_camp_gis_marker_route1_idx" ("gis_marker_route_id","gis_marker_route_type_id"),
        CONSTRAINT "fk_camp_camp_type1"
          FOREIGN KEY ("camp_type_id")
          REFERENCES "camp_type" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_camp_gis_marker_route1"
          FOREIGN KEY ("gis_marker_route_id", "gis_marker_route_type_id")
          REFERENCES "gis_marker_route" ("id", "gis_marker_route_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=20`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."camp_BEFORE_INSERT" BEFORE INSERT ON "camp" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_marker_route_type_id" = 8;
      // END ;;
    );

    await client.query(
      `CREATE TABLE "trailhead" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "notes_parking" text,
        "trailhead_developed_id" int(11) NOT NULL DEFAULT '1',
        "has_parking" tinyint(1) DEFAULT NULL,
        "has_water" tinyint(1) DEFAULT NULL,
        "has_restroom" tinyint(1) DEFAULT NULL,
        "map_resources_id" int(11) DEFAULT NULL,
        "gis_marker_route_id" int(11) DEFAULT NULL,
        "gis_marker_route_type_id" int(11) DEFAULT '7',
        "gis_parking_alternate_id" int(11) DEFAULT NULL,
        "gis_parking_alternate_type_id" int(11) DEFAULT '5',
        PRIMARY KEY ("id"),
        KEY "fk_trailheads_trailhead_developed1_idx" ("trailhead_developed_id"),
        KEY "fk_trailheads_map_resources1_idx" ("map_resources_id"),
        KEY "fk_trailhead_gis_marker_route1_idx" ("gis_marker_route_id","gis_marker_route_type_id"),
        KEY "fk_trailhead_gis_marker_route2_idx" ("gis_parking_alternate_id","gis_parking_alternate_type_id"),
        CONSTRAINT "fk_trailhead_gis_marker_route1"
          FOREIGN KEY ("gis_marker_route_id", "gis_marker_route_type_id")
          REFERENCES "gis_marker_route" ("id", "gis_marker_route_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trailhead_gis_marker_route2"
          FOREIGN KEY ("gis_parking_alternate_id", "gis_parking_alternate_type_id")
          REFERENCES "gis_marker_route" ("id", "gis_marker_route_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trailheads_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trailheads_trailhead_developed1"
          FOREIGN KEY ("trailhead_developed_id")
          REFERENCES "trailhead_developed" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."trailhead_BEFORE_INSERT" BEFORE INSERT ON "trailhead" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_marker_route_type_id" = 7;
      //     SET NEW."gis_parking_alternate_type_id" = 5;
      // END ;;

      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."trailhead_BEFORE_UPDATE" BEFORE UPDATE ON "trailhead" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_marker_route_type_id" = 7;
      //     SET NEW."gis_parking_alternate_type_id" = 5;
      // END ;;
    );

    // === Paths ===
    await client.query(
      `CREATE TABLE "trip_path" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "path_set_id" int(11) DEFAULT NULL,
        "trip_path_recorded_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_trip_path_path_set1_idx" ("path_set_id"),
        KEY "fk_trip_path_trip_path_recorded1_idx" ("trip_path_recorded_id"),
        CONSTRAINT "fk_trip_path_path_set1"
          FOREIGN KEY ("path_set_id")
          REFERENCES "path_set" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_path_trip_path_recorded1"
          FOREIGN KEY ("trip_path_recorded_id")
          REFERENCES "trip_path_recorded" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    // === Trips ===
    await client.query(
      `CREATE TABLE "trip" (
        "id" int(11) NOT NULL,
        "trip_path_id" int(11) DEFAULT NULL,
        "report_trip_introduction_id" int(11) DEFAULT NULL,
        "report_trip_summary_id" int(11) DEFAULT NULL,
        "report_trip_id" int(11) DEFAULT NULL,
        "trip_tags_id" int(11) DEFAULT NULL,
        "description" varchar(45) NOT NULL,
        "date_start" date DEFAULT NULL
          COMMENT 'Calendar Entry - calculated from days\n',
        "date_finish" date DEFAULT NULL
          COMMENT 'Calendar Entry - calculated from days\n',
        "season_id" int(11) DEFAULT NULL,
        "route_condition_id" int(11) DEFAULT NULL,
        "time_taken" time DEFAULT NULL
          COMMENT 'Calculated from date start & finish\n',
        "weight_carried" int(11) DEFAULT NULL
          COMMENT 'Averaged from days where non-zero weight is carried. Lbs\n',
        PRIMARY KEY ("id"),
        KEY "fk_trips_trip_reports1_idx" ("report_trip_id"),
        KEY "fk_trips_trip_seasons1_idx" ("season_id"),
        KEY "fk_trips_trip_route_conditions1_idx" ("route_condition_id"),
        KEY "fk_trip_trip_path1_idx" ("trip_path_id"),
        KEY "fk_trip_trip_tags1_idx" ("trip_tags_id"),
        CONSTRAINT "fk_trip_trip_path1"
          FOREIGN KEY ("trip_path_id")
          REFERENCES "trip_path" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_trip_tags1"
          FOREIGN KEY ("trip_tags_id")
          REFERENCES "trip_tags" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trips_trip_reports1"
          FOREIGN KEY ("report_trip_id")
          REFERENCES "report_trip" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trips_trip_route_conditions1"
          FOREIGN KEY ("route_condition_id")
          REFERENCES "trip_route_condition" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trips_trip_seasons1"
          FOREIGN KEY ("season_id")
          REFERENCES "trip_season" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    // map_resource,
    await client.query(
      `CREATE TABLE "trip_by_day" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "trip_id" int(11) NOT NULL,
        "report_trip_id" int(11) DEFAULT NULL,
        "date" date NOT NULL,
        "description" text COMMENT 'Like photo album description\n',
        "time_taken" time DEFAULT NULL COMMENT 'Minutes\n',
        "weight_carried" int(11) DEFAULT NULL COMMENT 'lbs',
        "notes" text,
        "bivy" tinyint(1) NOT NULL DEFAULT '1',
        "camp_id" int(11) DEFAULT NULL
          COMMENT 'To be specified if an official camp is used.',
        "camp_latitude" float DEFAULT NULL
          COMMENT 'Decimal degrees to be specified if an official camp is not used.',
        "camp_longitude" float DEFAULT NULL
          COMMENT 'Decimal degrees to be specified if an official camp is not used.',
        "path_recorded_time_start" datetime DEFAULT NULL
          COMMENT 'Time stamp for the first lat/long recorded in the corresponding trip path recorded.',
        "path_recorded_time_end" datetime DEFAULT NULL
          COMMENT 'Time stamp for the last lat/long recorded in the corresponding trip path recorded.',
        "map_resources_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_day_stats_map_resources1_idx" ("map_resources_id"),
        KEY "fk_day_stats_trips1_idx" ("trip_id"),
        KEY "fk_trip_by_day_camp1_idx" ("camp_id"),
        KEY "fk_trip_by_day_report_trip1_idx" ("report_trip_id"),
        CONSTRAINT "fk_day_stats_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_day_stats_trips1"
          FOREIGN KEY ("trip_id")
          REFERENCES "trip" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_by_day_camp1"
          FOREIGN KEY ("camp_id")
          REFERENCES "camp" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_by_day_report_trip1"
          FOREIGN KEY ("report_trip_id")
          REFERENCES "report_trip" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
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