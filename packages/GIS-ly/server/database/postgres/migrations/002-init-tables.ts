export class InitTables002 {
  public async up(client): Promise<void> {
    // GIS Points, lines & shapes
    // reference
    await client.query(
      `CREATE TABLE "gis_marker_route" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_marker_route_type_id" int(11) NOT NULL,
        "name" varchar(45) NOT NULL,
        "description" text,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "altitude" float DEFAULT NULL COMMENT 'meters',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "gis_marker_route_gis_marker_route_type1_idx" ("id","gis_marker_route_type_id"),
        UNIQUE KEY "gis_marker_route_location_idx" ("latitude","longitude")
          COMMENT 'Using a unique index which is a combination of latitude and longitude can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_marker_route_gis_marker_route_type1_idx" ("gis_marker_route_type_id"),
        KEY "fk_gis_marker_route_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_gis_marker_route_gis_marker_route_type1"
          FOREIGN KEY ("gis_marker_route_type_id")
          REFERENCES "gis_marker_route_type" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gis_marker_route_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=20 COMMENT='Markers that are tightly related to route directions and form.'`
    );

    await client.query(
      `CREATE TABLE "gis_marker_interest" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_marker_interest_type_id" int(11) NOT NULL,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "gis_marker_interest_gis_marker_interest_type1_idx" ("id","gis_marker_interest_type_id"),
        UNIQUE KEY "gis_marker_interest_location_idx" ("latitude","longitude")
          COMMENT 'Using a unique index which is a combination of latitude and longitude can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_marker_interest_gis_marker_interest_type1_idx" ("gis_marker_interest_type_id"),
        KEY "fk_gis_marker_interest_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_gis_marker_interest_gis_marker_interest_type1"
          FOREIGN KEY ("gis_marker_interest_type_id")
          REFERENCES "gis_marker_interest_type" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gis_marker_interest_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) `
    );

    await client.query(
      `CREATE TABLE "gis_feature_large" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_feature_large_type_id" int(11) NOT NULL,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "altitude" float DEFAULT NULL COMMENT 'meters',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "gis_feature_large_gis_feature_large_type1_idx" ("id","gis_feature_large_type_id"),
        UNIQUE KEY "gis_feature_large_location_idx" ("latitude","longitude") COMMENT 'Using a unique index which is a combination of latitude and longitude can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_feature_large_gis_feature_large_type1_idx" ("gis_feature_large_type_id"),
        KEY "fk_gis_feature_large_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_gis_feature_large_gis_feature_large_type1"
          FOREIGN KEY ("gis_feature_large_type_id")
          REFERENCES "gis_feature_large_type" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gis_feature_large_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) COMMENT='Any feature that is often represented as a line or shape.';`
    );

    await client.query(
      `CREATE TABLE "gis_feature_large_point" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_feature_large_id" int(11) NOT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "sequence" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "location_sequence_idx" ("latitude","longitude","sequence")
          COMMENT 'Using a unique index which is a combination of latitude and longitude and sequnce can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_feature_large_point_gis_feature_large1_idx" ("gis_feature_large_id"),
        CONSTRAINT "fk_gis_feature_large_point_gis_feature_large1"
          FOREIGN KEY ("gis_feature_large_id")
          REFERENCES "gis_feature_large" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "gis_network" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_network_type_id" int(11) NOT NULL,
        "parent_id" int(11) DEFAULT NULL COMMENT 'If null, tuple is taken as root parent.',
        "name" varchar(45) NOT NULL,
        "description" text,
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "gis_network_gis_network_type1_idx" ("id","gis_network_type_id"),
        KEY "fk_gis_network_gis_network1_idx" ("parent_id"),
        KEY "fk_gis_network_gis_network_type1_idx" ("gis_network_type_id"),
        KEY "fk_gis_network_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_gis_network_gis_network1"
        FOREIGN KEY ("parent_id")
        REFERENCES "gis_network" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gis_network_gis_network_type1"
          FOREIGN KEY ("gis_network_type_id")
          REFERENCES "gis_network_type" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gis_network_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) COMMENT='For hierarchical paths.';`
    );

    await client.query(
      `CREATE TABLE "gis_network_point" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_network_id" int(11) NOT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "sequence" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "location_sequence_idx" ("latitude","longitude","sequence")
          COMMENT 'Using a unique index which is a combination of latitude and longitude and sequnce can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_network_point_gis_network1_idx" ("gis_network_id"),
        CONSTRAINT "fk_gis_network_point_gis_network1"
          FOREIGN KEY ("gis_network_id")
          REFERENCES "gis_network" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) `
    );

    await client.query(
      `CREATE TABLE "gis_region" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_region_type_id" int(11) NOT NULL,
        "parent_id" int(11) DEFAULT NULL COMMENT 'If null, tuple is taken as root parent.',
        "name" varchar(45) NOT NULL,
        "description" text,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "gis_region_gis_region_type1_idx" ("id","gis_region_type_id"),
        UNIQUE KEY "gis_region_location_idx" ("latitude","longitude")
          COMMENT 'Using a unique index which is a combination of latitude and longitude can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_region_gis_region1_idx" ("parent_id"),
        KEY "fk_gis_region_gis_region_type1_idx" ("gis_region_type_id"),
        KEY "fk_gis_region_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_gis_region_gis_region1"
          FOREIGN KEY ("parent_id")
          REFERENCES "gis_region" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gis_region_gis_region_type1"
          FOREIGN KEY ("gis_region_type_id")
          REFERENCES "gis_region_type" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gis_region_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) COMMENT='For hierarchical regions. \nReferencing tables only need to be created if parent-child sub-regions are not 1 parent : n children. Otherwise, any parent-children hierarchical tables can be entirely located within this table.';
      `
    );

    await client.query(
      `CREATE TABLE "gis_region_point" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gis_region_id" int(11) NOT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "sequence" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "location_sequence_idx" ("latitude","longitude","sequence")
          COMMENT 'Using a unique index which is a combination of latitude and longitude and sequnce can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_region_point_gis_region1_idx" ("gis_region_id"),
        CONSTRAINT "fk_gis_region_point_gis_region1"
          FOREIGN KEY ("gis_region_id")
          REFERENCES "gis_region" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // GIS Paths (Routes, approaches, etc.)
    // path_segment_climbing
    await client.query(
      `CREATE TABLE "path_segment" (
        "id" int(11) NOT NULL,
        "path_segment_classification_id" int(11) DEFAULT '1',
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "length" float DEFAULT NULL
          COMMENT 'meters\n',
        "elevation_gain" float DEFAULT NULL
          COMMENT 'meters\n',
        "elevation_loss" float DEFAULT NULL
          COMMENT 'meters\n',
        "slope_max" float DEFAULT NULL
          COMMENT 'Decimal representation of Rise/run.',
        "slope_min" float DEFAULT NULL
          COMMENT 'Decimal representation of Rise/run.',
        "slope_average" float DEFAULT NULL
          COMMENT 'Decimal representation of Rise/run.',
        "forward_climbing_segment_id" int(11) DEFAULT NULL,
        "backward_climbing_segment_id" int(11) DEFAULT NULL,
        "is_public" tinyint(1) NOT NULL DEFAULT '1',
        PRIMARY KEY ("id"),
        KEY "fk_path_segment_path_segment_climbing1_idx" ("forward_climbing_segment_id"),
        KEY "fk_path_segment_path_segment_climbing2_idx" ("backward_climbing_segment_id"),
        KEY "fk_path_segment_path_segment_rating1_idx" ("path_segment_classification_id"),
        CONSTRAINT "fk_path_segment_path_segment_climbing1"
          FOREIGN KEY ("forward_climbing_segment_id")
          REFERENCES "path_segment_climbing" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_segment_path_segment_climbing2"
          FOREIGN KEY ("backward_climbing_segment_id")
          REFERENCES "path_segment_climbing" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_segment_path_segment_rating1"
          FOREIGN KEY ("path_segment_classification_id")
          REFERENCES "path_segment_classification" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) COMMENT='This is the fundamental polyline unit for a traveled path. The polyline can have multiple nodes, but all junctions to other segments only occur at the start or end. If a new junction is formed, the segment is split into two new segments.';
      `
    );

    await client.query(
      `CREATE TABLE "gis_path_point" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "path_segment_id" int(11) NOT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "altitude" float DEFAULT NULL
          COMMENT 'meters',
        "sequence" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "location_sequence_idx" ("latitude","longitude","sequence")
          COMMENT 'Using a unique index which is a combination of latitude and longitude and sequnce can help us prevent from making duplicate entries into the database.',
        KEY "fk_gis_path_point_path_segment1_idx" ("path_segment_id"),
        CONSTRAINT "fk_gis_path_point_path_segment1"
          FOREIGN KEY ("path_segment_id")
          REFERENCES "path_segment" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // GPS Tracks & Placemarks
    // trip_path_recorded
    await client.query(
      `CREATE TABLE "gps_marker" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "trip_path_recorded_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_gps_marker_trip_path_recorded1_idx" ("trip_path_recorded_id"),
        CONSTRAINT "fk_gps_marker_trip_path_recorded1"
          FOREIGN KEY ("trip_path_recorded_id")
          REFERENCES "trip_path_recorded" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "gps_marker_point" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gps_marker_id" int(11) NOT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "altitude" float DEFAULT NULL
          COMMENT 'meters',
        "date_time" datetime NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "gps_marker_point_date_time_location_idx" ("latitude","longitude","date_time")
          COMMENT 'Using a unique index which is a combination of latitude, longitude, and date_time can help us prevent from making duplicate entries into the database.',
        UNIQUE KEY "gps_marker_point_date_time_UNIQUE" ("date_time"),
        KEY "fk_gps_marker_point_gps_marker1_idx" ("gps_marker_id"),
        CONSTRAINT "fk_gps_marker_point_gps_marker1"
          FOREIGN KEY ("gps_marker_id")
          REFERENCES "gps_marker" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // trip_path_recorded
    await client.query(
      `CREATE TABLE "gps_track" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "trip_path_recorded_id" int(11) DEFAULT NULL,
        "travel_mode_id" int(11) DEFAULT NULL,
        "date" date NOT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_gps_path_travel_mode1_idx" ("travel_mode_id"),
        KEY "fk_gps_path_trip_path_recorded1_idx" ("trip_path_recorded_id"),
        CONSTRAINT "fk_gps_path_travel_mode1"
          FOREIGN KEY ("travel_mode_id")
          REFERENCES "travel_mode" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_gps_path_trip_path_recorded1"
          FOREIGN KEY ("trip_path_recorded_id")
          REFERENCES "trip_path_recorded" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "gps_track_point" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "gps_track_id" int(11) NOT NULL,
        "latitude" float NOT NULL,
        "longitude" float NOT NULL,
        "altitude" float DEFAULT NULL
          COMMENT 'meters',
        "date_time" datetime NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "gps_track_point_date_time_location_idx" ("latitude","longitude","date_time")
          COMMENT 'Using a unique index which is a combination of latitude, longitude, and date_time can help us prevent from making duplicate entries into the database.',
        UNIQUE KEY "gps_track_point_date_time_UNIQUE" ("date_time"),
        KEY "fk_gps_track_point_gps_track1_idx" ("gps_track_id"),
        CONSTRAINT "fk_gps_track_point_gps_track1"
          FOREIGN KEY ("gps_track_id")
          REFERENCES "gps_track" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) `
    );

    // trailhead
    await client.query(
      `CREATE TABLE "trip_path_recorded" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "date" date NOT NULL,
        "trailhead_start_id" int(11) DEFAULT NULL,
        "trailhead_end_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_trip_path_recorded_trailhead1_idx" ("trailhead_start_id"),
        KEY "fk_trip_path_recorded_trailhead2_idx" ("trailhead_end_id"),
        CONSTRAINT "fk_trip_path_recorded_trailhead1"
          FOREIGN KEY ("trailhead_start_id")
          REFERENCES "trailhead" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_path_recorded_trailhead2"
          FOREIGN KEY ("trailhead_end_id")
          REFERENCES "trailhead" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "country" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '1',
        PRIMARY KEY ("id"),
        KEY "fk_country_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        CONSTRAINT "fk_country_gis_region1"
          FOREIGN KEY ("gis_region_id", "gis_region_type_id")
          REFERENCES "gis_region" ("id", "gis_region_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=198`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."country_BEFORE_INSERT" BEFORE INSERT ON "country" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 1;
      // END;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."country_BEFORE_UPDATE" BEFORE UPDATE ON "country" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 1;
      // END;;
    );

    await client.query(
      `CREATE TABLE "state" (
        "id" int(11) NOT NULL AUTO_INCREMENT
          COMMENT 'Note: If there is no state in a country, add/use the following entry convention:\nname = N/A ([country_name])\ncountry = country_id',
        "name" varchar(45) NOT NULL
          COMMENT 'Note: If there is no state in a country, add/use the following entry convention:\nname = N/A ([country_name])\ncountry = country_id',
        "description" text,
        "country_id" int(11) NOT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '2',
        PRIMARY KEY ("id"),
        KEY "fk_states_countries1_idx" ("country_id"),
        KEY "fk_state_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        CONSTRAINT "fk_state_gis_region1"
          FOREIGN KEY ("gis_region_id", "gis_region_type_id")
          REFERENCES "gis_region" ("id", "gis_region_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_states_countries1"
          FOREIGN KEY ("country_id")
          REFERENCES "country" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=97`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."state_BEFORE_INSERT" BEFORE INSERT ON "state" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 2;
      // END;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."state_BEFORE_UPDATE" BEFORE UPDATE ON "state" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 2;
      // END;;
    );

    await client.query(
      `CREATE TABLE "public_land" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "state_id" int(11) NOT NULL,
        "state_id_secondary" int(11) DEFAULT NULL,
        "land_ownership_id" int(11) NOT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '4',
        PRIMARY KEY ("id"),
        KEY "fk_public_lands_states1_idx" ("state_id"),
        KEY "fk_public_lands_land_ownership1_idx" ("land_ownership_id"),
        KEY "fk_public_land_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        CONSTRAINT "fk_public_land_gis_region1"
          FOREIGN KEY ("gis_region_id", "gis_region_type_id")
          REFERENCES "gis_region" ("id", "gis_region_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_public_lands_land_ownership1"
          FOREIGN KEY ("land_ownership_id")
          REFERENCES "land_ownership" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_public_lands_states1"
          FOREIGN KEY ("state_id")
          REFERENCES "state" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=345`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."public_land_BEFORE_INSERT" BEFORE INSERT ON "public_land" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 4;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."public_land_BEFORE_UPDATE" BEFORE UPDATE ON "public_land" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 4;
      // END;;
    );

    // gis_region
    await client.query(
      `CREATE TABLE "metro_area" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "name_alternate" varchar(45) DEFAULT NULL,
        "description" text,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '3',
        PRIMARY KEY ("id"),
        KEY "fk_metro_area_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        CONSTRAINT "fk_metro_area_gis_region1"
          FOREIGN KEY ("gis_region_id", "gis_region_type_id")
          REFERENCES "gis_region" ("id", "gis_region_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=14`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."metro_area_BEFORE_INSERT" BEFORE INSERT ON "metro_area" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 3;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."metro_area_BEFORE_UPDATE" BEFORE UPDATE ON "metro_area" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 3;
      // END ;;
      // DELIMITER ;
    );

    await client.query(
      `CREATE TABLE "city" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "state_id" int(11) NOT NULL,
        "metro_area_id" int(11) DEFAULT NULL,
        "gis_feature_large_id" int(11) DEFAULT NULL,
        "gis_feature_large_type_id" int(11) DEFAULT '5',
        PRIMARY KEY ("id"),
        KEY "fk_city_state1_idx" ("state_id"),
        KEY "fk_city_metro_area1_idx" ("metro_area_id"),
        KEY "fk_city_gis_feature_large1_idx" ("gis_feature_large_id","gis_feature_large_type_id"),
        CONSTRAINT "fk_city_gis_feature_large1"
          FOREIGN KEY ("gis_feature_large_id", "gis_feature_large_type_id")
          REFERENCES "gis_feature_large" ("id", "gis_feature_large_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_city_metro_area1"
          FOREIGN KEY ("metro_area_id")
          REFERENCES "metro_area" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_city_state1"
          FOREIGN KEY ("state_id")
          REFERENCES "state" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=17`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."city_BEFORE_INSERT" BEFORE INSERT ON "city" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_feature_large_type_id" = 5;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."city_BEFORE_UPDATE" BEFORE UPDATE ON "city" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_feature_large_type_id" = 5;
      // END ;;
    );

    await client.query(
      `CREATE TABLE "location" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "country_id" int(11) DEFAULT NULL COMMENT 'TODO: Make not null later when filled in for all states. Then make states_id nullable.',
        "state_id1" int(11) NOT NULL,
        "state_id2" int(11) DEFAULT NULL,
        "state_id3" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "unique_location_idx" ("country_id","state_id1"),
        KEY "fk_location_state1_idx" ("state_id1"),
        KEY "fk_location_country1_idx" ("country_id"),
        KEY "fk_location_state2_idx" ("state_id2"),
        KEY "fk_location_state3_idx" ("state_id3"),
        CONSTRAINT "fk_location_country1"
          FOREIGN KEY ("country_id")
          REFERENCES "country" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_location_state1"
          FOREIGN KEY ("state_id1")
          REFERENCES "state" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_location_state2"
          FOREIGN KEY ("state_id2")
          REFERENCES "state" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_location_state3"
          FOREIGN KEY ("state_id3")
          REFERENCES "state" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=66`
    );

    // Geography Regions
    // page
    // gis_region
    // reference
    await client.query(
      `CREATE TABLE "geography_region_level_1" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "page_id" int(11) DEFAULT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '7' COMMENT '\n',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_geography_region_level_1_pages1_idx" ("page_id"),
        KEY "fk_geography_region_level_1_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        KEY "fk_geography_region_level_1_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_geography_region_level_1_gis_region1" FOREIGN KEY ("gis_region_id", "gis_region_type_id") REFERENCES "gis_region" ("id", "gis_region_type_id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_1_pages1" FOREIGN KEY ("page_id") REFERENCES "page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_1_reference1" FOREIGN KEY ("reference_id") REFERENCES "reference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      ) AUTO_INCREMENT=8 `
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_1_BEFORE_INSERT" BEFORE INSERT ON "geography_region_level_1" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_1_BEFORE_UPDATE" BEFORE UPDATE ON "geography_region_level_1" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
    );

    // page
    // gis_region
    // reference
    await client.query(
      `CREATE TABLE "geography_region_level_2" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "geography_region_level_1_id" int(11) NOT NULL,
        "page_id" int(11) DEFAULT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '7',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_geography_region_level_1_copy1_geography_region_level_11_idx" ("geography_region_level_1_id"),
        KEY "fk_geography_region_level_1_copy1_pages1_idx" ("page_id"),
        KEY "fk_geography_region_level_2_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        KEY "fk_geography_region_level_2_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_geography_region_level_1_copy1_geography_region_level_11" FOREIGN KEY ("geography_region_level_1_id") REFERENCES "geography_region_level_1" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_1_copy1_pages1" FOREIGN KEY ("page_id") REFERENCES "page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_2_gis_region1" FOREIGN KEY ("gis_region_id", "gis_region_type_id") REFERENCES "gis_region" ("id", "gis_region_type_id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_2_reference1" FOREIGN KEY ("reference_id") REFERENCES "reference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      ) AUTO_INCREMENT=63 `
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_2_BEFORE_INSERT" BEFORE INSERT ON "geography_region_level_2" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_2_BEFORE_UPDATE" BEFORE UPDATE ON "geography_region_level_2" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;
    );

    // page
    // gis_region
    // reference
    await client.query(
      `CREATE TABLE "geography_region_level_3" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "geography_region_level_2_id" int(11) NOT NULL,
        "page_id" int(11) DEFAULT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT NULL COMMENT '\n',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_geography_region_level_1_copy2_geography_region_level_1__idx" ("geography_region_level_2_id"),
        KEY "fk_geography_region_level_1_copy2_pages1_idx" ("page_id"),
        KEY "fk_geography_region_level_3_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        KEY "fk_geography_region_level_3_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_geography_region_level_1_copy2_geography_region_level_1_co1" FOREIGN KEY ("geography_region_level_2_id") REFERENCES "geography_region_level_2" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_1_copy2_pages1" FOREIGN KEY ("page_id") REFERENCES "page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_3_gis_region1" FOREIGN KEY ("gis_region_id", "gis_region_type_id") REFERENCES "gis_region" ("id", "gis_region_type_id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_3_reference1" FOREIGN KEY ("reference_id") REFERENCES "reference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      ) AUTO_INCREMENT=343`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_3_BEFORE_INSERT" BEFORE INSERT ON "geography_region_level_3" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_3_BEFORE_UPDATE" BEFORE UPDATE ON "geography_region_level_3" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;
    );

    // page
    // gis_region
    // reference
    await client.query(
      `CREATE TABLE "geography_region_level_4" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "geography_region_level_3_id" int(11) NOT NULL,
        "page_id" int(11) DEFAULT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '7',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_geography_region_level_1_copy3_geography_region_level_1__idx" ("geography_region_level_3_id"),
        KEY "fk_geography_region_level_1_copy3_pages1_idx" ("page_id"),
        KEY "fk_geography_region_level_4_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        KEY "fk_geography_region_level_4_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_geography_region_level_1_copy3_geography_region_level_1_co1" FOREIGN KEY ("geography_region_level_3_id") REFERENCES "geography_region_level_3" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_1_copy3_pages1" FOREIGN KEY ("page_id") REFERENCES "page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_4_gis_region1" FOREIGN KEY ("gis_region_id", "gis_region_type_id") REFERENCES "gis_region" ("id", "gis_region_type_id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_4_reference1" FOREIGN KEY ("reference_id") REFERENCES "reference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      ) AUTO_INCREMENT=427`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_4_BEFORE_INSERT" BEFORE INSERT ON "geography_region_level_4" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_4_BEFORE_UPDATE" BEFORE UPDATE ON "geography_region_level_4" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;
    );

    // page
    // gis_region
    // reference
    await client.query(
      `CREATE TABLE "geography_region_level_5" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "geography_region_level_4_id" int(11) NOT NULL,
        "page_id" int(11) DEFAULT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '7' COMMENT 'Decimal representation - lat, long, …\n',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_geography_region_level_1_copy3_copy1_geography_region_le_idx" ("geography_region_level_4_id"),
        KEY "fk_geography_region_level_1_copy3_copy1_pages1_idx" ("page_id"),
        KEY "fk_geography_region_level_5_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        KEY "fk_geography_region_level_5_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_geography_region_level_1_copy3_copy1_geography_region_leve1" FOREIGN KEY ("geography_region_level_4_id") REFERENCES "geography_region_level_4" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_1_copy3_copy1_pages1" FOREIGN KEY ("page_id") REFERENCES "page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_5_gis_region1" FOREIGN KEY ("gis_region_id", "gis_region_type_id") REFERENCES "gis_region" ("id", "gis_region_type_id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_5_reference1" FOREIGN KEY ("reference_id") REFERENCES "reference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      ) AUTO_INCREMENT=969`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_5_BEFORE_INSERT" BEFORE INSERT ON "geography_region_level_5" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_5_BEFORE_UPDATE" BEFORE UPDATE ON "geography_region_level_5" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;
    );

    // page
    // gis_region
    // reference
    await client.query(
      `CREATE TABLE "geography_region_level_6" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "geography_region_level_5_id" int(11) NOT NULL,
        "page_id" int(11) DEFAULT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '7' COMMENT 'Decimal representation - lat, long, …\n',
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_geography_region_level_1_copy3_copy2_geography_region_le_idx" ("geography_region_level_5_id"),
        KEY "fk_geography_region_level_1_copy3_copy2_pages1_idx" ("page_id"),
        KEY "fk_geography_region_level_6_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        KEY "fk_geography_region_level_6_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_geography_region_level_1_copy3_copy2_geography_region_leve1"
          FOREIGN KEY ("geography_region_level_5_id")
          REFERENCES "geography_region_level_5" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_1_copy3_copy2_pages1"
          FOREIGN KEY ("page_id")
          REFERENCES "page" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_6_gis_region1"
          FOREIGN KEY ("gis_region_id", "gis_region_type_id")
          REFERENCES "gis_region" ("id", "gis_region_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_level_6_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=1166`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_6_BEFORE_INSERT" BEFORE INSERT ON "geography_region_level_6" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."geography_region_level_6_BEFORE_UPDATE" BEFORE UPDATE ON "geography_region_level_6" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 7;
      // END ;;
      // DELIMITER ;
    );

    await client.query(
      `CREATE TABLE "geography_region" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "geography_region_level_1_id" int(11) NOT NULL,
        "geography_region_level_2_id" int(11) NOT NULL,
        "geography_region_level_3_id" int(11) NOT NULL,
        "geography_region_level_4_id" int(11) DEFAULT NULL,
        "geography_region_level_5_id" int(11) DEFAULT NULL,
        "geography_region_level_6_id" int(11) DEFAULT NULL,
        "reference_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "unique_region_idx" ("geography_region_level_1_id","geography_region_level_2_id","geography_region_level_3_id","geography_region_level_4_id","geography_region_level_5_id","geography_region_level_6_id"),
        KEY "fk_geography_region_geography_region_level_11_idx" ("geography_region_level_1_id"),
        KEY "fk_geography_region_geography_region_level_21_idx" ("geography_region_level_2_id"),
        KEY "fk_geography_region_geography_region_level_31_idx" ("geography_region_level_3_id"),
        KEY "fk_geography_region_geography_region_level_41_idx" ("geography_region_level_4_id"),
        KEY "fk_geography_region_geography_region_level_51_idx" ("geography_region_level_5_id"),
        KEY "fk_geography_region_geography_region_level_61_idx" ("geography_region_level_6_id"),
        KEY "fk_geography_region_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_geography_region_geography_region_level_11"
          FOREIGN KEY ("geography_region_level_1_id")
          REFERENCES "geography_region_level_1" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_geography_region_level_21"
          FOREIGN KEY ("geography_region_level_2_id")
          REFERENCES "geography_region_level_2" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_geography_region_level_31"
          FOREIGN KEY ("geography_region_level_3_id")
          REFERENCES "geography_region_level_3" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_geography_region_level_41"
          FOREIGN KEY ("geography_region_level_4_id")
          REFERENCES "geography_region_level_4" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_geography_region_level_51"
          FOREIGN KEY ("geography_region_level_5_id")
          REFERENCES "geography_region_level_5" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_geography_region_level_61"
          FOREIGN KEY ("geography_region_level_6_id")
          REFERENCES "geography_region_level_6" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_geography_region_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    // maps & map resources
    await client.query(
      `CREATE TABLE "map_resource" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        PRIMARY KEY ("id")
      )`
    );

    // status
    await client.query(
      `CREATE TABLE "maps" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title" varchar(100) NOT NULL,
        "url" varchar(200) DEFAULT NULL,
        "tasks" text,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        KEY "fk_maps_status1_idx" ("status_id"),
        CONSTRAINT "fk_maps_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // status
    await client.query(
      `CREATE TABLE "file_google_earth" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title" varchar(100) NOT NULL,
        "url" varchar(200) DEFAULT NULL,
        "tasks" text,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        KEY "fk_files_ge_status1_idx" ("status_id"),
        CONSTRAINT "fk_files_ge_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // status
    await client.query(
      `CREATE TABLE "file_gpx" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title" varchar(100) NOT NULL,
        "url" varchar(200) DEFAULT NULL,
        "tasks" text,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        KEY "fk_files_gpx_status1_idx" ("status_id"),
        CONSTRAINT "fk_files_gpx_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // status
    await client.query(
      `CREATE TABLE "file_topo" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title" varchar(100) NOT NULL,
        "url" varchar(200) DEFAULT NULL,
        "tasks" text,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        KEY "fk_files_topo_status1_idx" ("status_id"),
        CONSTRAINT "fk_files_topo_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // status
    await client.query(
      `CREATE TABLE "photo_annotated" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title" varchar(100) NOT NULL,
        "url" varchar(200) DEFAULT NULL,
        "tasks" text,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        KEY "fk_annotated_images_status1_idx" ("status_id"),
        CONSTRAINT "fk_annotated_images_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) `
    );
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}