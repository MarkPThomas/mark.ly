export class InitTables002 {
  public async up(client): Promise<void> {
    // === Crag ===
    // public_land
    // state
    // gis_region
    await client.query(
      `CREATE TABLE "climbing_area" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "state_id" int(11) NOT NULL,
        "public_lands_id" int(11) DEFAULT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '5',
        PRIMARY KEY ("id"),
        KEY "fk_climbing_area_public_lands1_idx" ("public_lands_id"),
        KEY "fk_climbing_area_states1_idx" ("state_id"),
        KEY "fk_climbing_area_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        CONSTRAINT "fk_climbing_area_gis_region1"
          FOREIGN KEY ("gis_region_id", "gis_region_type_id")
          REFERENCES "gis_region" ("id", "gis_region_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_area_public_lands1"
          FOREIGN KEY ("public_lands_id")
          REFERENCES "public_land" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_area_states1"
          FOREIGN KEY ("state_id")
          REFERENCES "state" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=65`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_area_BEFORE_INSERT" BEFORE INSERT ON "climbing_area" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 5;
      // END ;;DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_area_BEFORE_UPDATE" BEFORE UPDATE ON "climbing_area" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 5;
      // END ;;
      // DELIMITER ;
    );

    // gis_region
    await client.query(
      `CREATE TABLE "climbing_crag_area" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "climbing_area_id" int(11) NOT NULL,
        "gis_region_id" int(11) DEFAULT NULL,
        "gis_region_type_id" int(11) DEFAULT '6',
        PRIMARY KEY ("id"),
        KEY "fk_crag_area_climbing_area1_idx" ("climbing_area_id"),
        KEY "fk_climbing_crag_area_gis_region1_idx" ("gis_region_id","gis_region_type_id"),
        CONSTRAINT "fk_climbing_crag_area_gis_region1"
          FOREIGN KEY ("gis_region_id", "gis_region_type_id")
          REFERENCES "gis_region" ("id", "gis_region_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_crag_area_climbing_area1"
          FOREIGN KEY ("climbing_area_id")
          REFERENCES "climbing_area" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=142`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_crag_area_BEFORE_INSERT" BEFORE INSERT ON "climbing_crag_area" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 6;
      // END ;;
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_crag_area_BEFORE_UPDATE" BEFORE UPDATE ON "climbing_crag_area" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_region_type_id" = 6;
      // END ;;
      // DELIMITER ;
    );

    // gis_feature_large
    await client.query(
      `CREATE TABLE "climbing_crag" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "climbing_area_id" int(11) NOT NULL,
        "crag_area_id" int(11) DEFAULT NULL,
        "gis_feature_large_id" int(11) DEFAULT NULL,
        "gis_feature_large_type_id" int(11) DEFAULT '1',
        PRIMARY KEY ("id"),
        KEY "fk_crag_crag_area1_idx" ("crag_area_id"),
        KEY "fk_crag_climbing_area1_idx" ("climbing_area_id"),
        KEY "fk_climbing_crag_gis_feature_large1_idx" ("gis_feature_large_id","gis_feature_large_type_id"),
        CONSTRAINT "fk_climbing_crag_gis_feature_large1"
          FOREIGN KEY ("gis_feature_large_id", "gis_feature_large_type_id")
          REFERENCES "gis_feature_large" ("id", "gis_feature_large_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_crag_climbing_area1"
          FOREIGN KEY ("climbing_area_id")
          REFERENCES "climbing_area" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_crag_crag_area1"
          FOREIGN KEY ("crag_area_id")
           REFERENCES "climbing_crag_area" ("id")
           ON DELETE SET NULL
           ON UPDATE CASCADE
      ) AUTO_INCREMENT=900`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_crag_BEFORE_INSERT" BEFORE INSERT ON "climbing_crag" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_feature_large_type_id" = 1;
      // END ;;DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_crag_BEFORE_UPDATE" BEFORE UPDATE ON "climbing_crag" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_feature_large_type_id" = 1;
      // END ;;
      // DELIMITER ;
    );

    // Gym
    await client.query(
      `CREATE TABLE "climbing_gym_franchise" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=7`
    );

    // gis_marker_interest
    // city
    await client.query(
      `CREATE TABLE "climbing_gym" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" text,
        "gym_franchise_id" int(11) NOT NULL,
        "city_id" int(11) NOT NULL,
        "gis_marker_interest_id" int(11) DEFAULT NULL,
        "gis_marker_interest_type_id" int(11) DEFAULT '9'
          COMMENT 'Should always be climbing gym type.',
        PRIMARY KEY ("id"),
        KEY "fk_climbing_gyms_gym_franchise1_idx" ("gym_franchise_id"),
        KEY "fk_climbing_gym_gis_marker_interest1_idx" ("gis_marker_interest_id","gis_marker_interest_type_id"),
        KEY "fk_climbing_gym_city1_idx" ("city_id"),
        CONSTRAINT "fk_climbing_gym_city1"
          FOREIGN KEY ("city_id")
          REFERENCES "city" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_gym_gis_marker_interest1"
          FOREIGN KEY ("gis_marker_interest_id", "gis_marker_interest_type_id")
          REFERENCES "gis_marker_interest" ("id", "gis_marker_interest_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_gyms_gym_franchise1"
          FOREIGN KEY ("gym_franchise_id")
          REFERENCES "climbing_gym_franchise" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=16`
      // DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_gym_BEFORE_INSERT" BEFORE INSERT ON "climbing_gym" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_marker_interest_type_id" = 9;
      // END ;;DELIMITER ;;
      // TRIGGER "markptho_outdoors"."climbing_gym_BEFORE_UPDATE" BEFORE UPDATE ON "climbing_gym" FOR EACH ROW
      // BEGIN
      //   SET NEW."gis_marker_interest_type_id" = 9;
      // END ;;
      // DELIMITER ;
    );

    // === climbing ratings ===
    await client.query(
      `CREATE TABLE "climbing_technical_rating" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade_ncss_id" int(11) DEFAULT NULL,
        "grade_yds_id" int(11) DEFAULT NULL,
        "grade_ice_water_id" int(11) DEFAULT NULL,
        "grade_ice_alpine_id" int(11) DEFAULT NULL,
        "grade_mixed_id" int(11) DEFAULT NULL,
        "grade_aid_new_wave_id" int(11) DEFAULT NULL,
        "grade_glacier_id" int(11) DEFAULT NULL,
        "grade_snow_id" int(11) DEFAULT NULL,
        "grade_alaskan_id" int(11) DEFAULT NULL,
        "grade_alpine_id" int(11) DEFAULT NULL,
        "grade_cascade_volcano_id" int(11) DEFAULT NULL,
        "grade_bouldering_hueco_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "unique_rating_idx" ("grade_ncss_id","grade_yds_id","grade_ice_water_id","grade_ice_alpine_id","grade_mixed_id","grade_aid_new_wave_id","grade_glacier_id","grade_snow_id","grade_alaskan_id","grade_alpine_id","grade_cascade_volcano_id","grade_bouldering_hueco_id"),
        KEY "fk_technical_rating_grade_yds1_idx" ("grade_yds_id"),
        KEY "fk_technical_rating_grade_ice_water1_idx" ("grade_ice_water_id"),
        KEY "fk_technical_rating_grade_ice_alpine1_idx" ("grade_ice_alpine_id"),
        KEY "fk_technical_rating_grade_mixed1_idx" ("grade_mixed_id"),
        KEY "fk_technical_rating_grade_aid_new_wave1_idx" ("grade_aid_new_wave_id"),
        KEY "fk_technical_rating_grade_glacier1_idx" ("grade_glacier_id"),
        KEY "fk_technical_rating_grade_snow1_idx" ("grade_snow_id"),
        KEY "fk_technical_rating_grade_alaskan1_idx" ("grade_alaskan_id"),
        KEY "fk_technical_rating_grade_alpine1_idx" ("grade_alpine_id"),
        KEY "fk_technical_rating_grade_cascade_volcano1_idx" ("grade_cascade_volcano_id"),
        KEY "fk_technical_rating_grade_bouldering_hueco1_idx" ("grade_bouldering_hueco_id"),
        KEY "fk_climbing_technical_rating_grade_ncss1_idx" ("grade_ncss_id"),
        CONSTRAINT "fk_climbing_technical_rating_grade_ncss1"
          FOREIGN KEY ("grade_ncss_id")
          REFERENCES "grade_ncss" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_aid_new_wave1"
          FOREIGN KEY ("grade_aid_new_wave_id")
          REFERENCES "grade_aid_new_wave" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_alaskan1"
          FOREIGN KEY ("grade_alaskan_id")
          REFERENCES "grade_alaskan" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_alpine1"
          FOREIGN KEY ("grade_alpine_id")
          REFERENCES "grade_alpine" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_bouldering_hueco1"
          FOREIGN KEY ("grade_bouldering_hueco_id")
          REFERENCES "grade_bouldering_hueco" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_cascade_volcano1"
          FOREIGN KEY ("grade_cascade_volcano_id")
          REFERENCES "grade_cascade_volcano" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_glacier1"
          FOREIGN KEY ("grade_glacier_id")
          REFERENCES "grade_glacier" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_ice_alpine1"
          FOREIGN KEY ("grade_ice_alpine_id")
          REFERENCES "grade_ice_alpine" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_ice_water1"
          FOREIGN KEY ("grade_ice_water_id")
          REFERENCES "grade_ice_water" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_mixed1"
          FOREIGN KEY ("grade_mixed_id")
          REFERENCES "grade_mixed" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_snow1"
          FOREIGN KEY ("grade_snow_id")
          REFERENCES "grade_snow" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_technical_rating_grade_yds1"
          FOREIGN KEY ("grade_yds_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=511`
    );

    await client.query(
      `CREATE TABLE "grade_alpine_conversion" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade_uiaa_id" int(11) DEFAULT NULL,
        "grade_alpine_id" int(11) DEFAULT NULL,
        "grade_ncss_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_alpine_grade_conversion_grade_uiaa1_idx" ("grade_uiaa_id"),
        KEY "fk_alpine_grade_conversion_grade_alpine1_idx" ("grade_alpine_id"),
        KEY "fk_grade_alpine_conversion_grade_ncss1_idx" ("grade_ncss_id"),
        CONSTRAINT "fk_alpine_grade_conversion_grade_alpine1"
          FOREIGN KEY ("grade_alpine_id")
          REFERENCES "grade_alpine" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_alpine_grade_conversion_grade_uiaa1"
          FOREIGN KEY ("grade_uiaa_id")
          REFERENCES "grade_uiaa" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_grade_alpine_conversion_grade_ncss1"
          FOREIGN KEY ("grade_ncss_id")
          REFERENCES "grade_ncss" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=26`
    );

    await client.query(
      `CREATE TABLE "grade_rock_grade_conversion" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade_yds_id" int(11) DEFAULT NULL,
        "grade_yds_old_id" int(11) DEFAULT NULL COMMENT 'Converting 5.10-/+ to a,b,c,d system.',
        "grade_uiaa_id" int(11) DEFAULT NULL,
        "grade_french_id" int(11) DEFAULT NULL,
        "grade_bouldering_hueco_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_rock_grade_conversion_grade_yds1_idx" ("grade_yds_id"),
        KEY "fk_rock_grade_conversion_grade_uiaa1_idx" ("grade_uiaa_id"),
        KEY "fk_rock_grade_conversion_grade_french1_idx" ("grade_french_id"),
        KEY "fk_rock_grade_conversion_grade_bouldering_hueco1_idx" ("grade_bouldering_hueco_id"),
        KEY "fk_rock_grade_conversion_grade_yds2_idx" ("grade_yds_old_id"),
        CONSTRAINT "fk_rock_grade_conversion_grade_bouldering_hueco1"
          FOREIGN KEY ("grade_bouldering_hueco_id")
          REFERENCES "grade_bouldering_hueco" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_rock_grade_conversion_grade_french1"
          FOREIGN KEY ("grade_french_id")
          REFERENCES "grade_french" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_rock_grade_conversion_grade_uiaa1"
          FOREIGN KEY ("grade_uiaa_id")
          REFERENCES "grade_uiaa" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_rock_grade_conversion_grade_yds1"
          FOREIGN KEY ("grade_yds_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_rock_grade_conversion_grade_yds2"
          FOREIGN KEY ("grade_yds_old_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=49`
    );

    await client.query(
      `CREATE TABLE "climbing_grade_system" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name_full" varchar(45) NOT NULL,
        "name_common" varchar(45) DEFAULT NULL,
        "abbreviation" varchar(45) DEFAULT NULL,
        "usage_area" varchar(500) DEFAULT NULL,
        "origin" text,
        "description" text,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=21`
    );

    await client.query(
      `CREATE TABLE "grade_system_to_usage" (
        "climbing_grade_system_id" int(11) NOT NULL,
        "climbing_type_id" int(11) NOT NULL,
        PRIMARY KEY ("climbing_grade_system_id","climbing_type_id"),
        KEY "fk_climbing_grade_system_has_climbing_type_climbing_type1_idx" ("climbing_type_id"),
        KEY "fk_climbing_grade_system_has_climbing_type_climbing_grade_s_idx" ("climbing_grade_system_id"),
        CONSTRAINT "fk_climbing_grade_system_has_climbing_type_climbing_grade_sys1"
          FOREIGN KEY ("climbing_grade_system_id")
          REFERENCES "climbing_grade_system" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_grade_system_has_climbing_type_climbing_type1"
          FOREIGN KEY ("climbing_type_id")
          REFERENCES "climbing_type" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // === lists ===
    // gis_region
    await client.query(
      `CREATE TABLE "list_internal_category" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(500) DEFAULT NULL,
        "description" text,
        "gis_region_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_list_internal_category_gis_region1_idx" ("gis_region_id"),
        CONSTRAINT "fk_list_internal_category_gis_region1"
          FOREIGN KEY ("gis_region_id")
          REFERENCES "gis_region" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=86`
    );

    // gis_region
    await client.query(
      `CREATE TABLE "list_internal_category_sub" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(500) DEFAULT NULL,
        "description" text,
        "gis_region_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_list_internal_category_sub_gis_region1_idx" ("gis_region_id"),
        CONSTRAINT "fk_list_internal_category_sub_gis_region1"
          FOREIGN KEY ("gis_region_id")
          REFERENCES "gis_region" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=28`
    );

    await client.query(
      `CREATE TABLE "list_of_custom_ticks" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "date" date DEFAULT NULL,
        "description" text,
        "tick_category_id" int(11) NOT NULL DEFAULT '1',
        PRIMARY KEY ("id"),
        KEY "fk_tick_list_tick_category1_idx" ("tick_category_id"),
        CONSTRAINT "fk_tick_list_tick_category1"
          FOREIGN KEY ("tick_category_id")
          REFERENCES "tick_category" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // page
    await client.query(
      `CREATE TABLE "list_category" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(500) NOT NULL,
        "attribution" varchar(500) DEFAULT NULL,
        "description" text,
        "notes" text,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_list_category_pages1_idx" ("page_id"),
        CONSTRAINT "fk_list_category_pages1"
          FOREIGN KEY ("page_id")
          REFERENCES "page" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=9`
    );

    // page
    await client.query(
      `CREATE TABLE "list_of_features" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(500) NOT NULL,
        "attribution" varchar(500) DEFAULT NULL,
        "description" text,
        "notes" text,
        "list_category_id" int(11) DEFAULT NULL,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_lists_features_pages1_idx" ("page_id"),
        KEY "fk_list_of_features_list_category1_idx" ("list_category_id"),
        CONSTRAINT "fk_list_of_features_list_category1"
          FOREIGN KEY ("list_category_id")
           REFERENCES "list_category" ("id")
           ON DELETE SET NULL
           ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_features_pages1"
          FOREIGN KEY ("page_id")
          REFERENCES "page" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=24`
    );

    // page
    await client.query(
      `CREATE TABLE "list_of_routes" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(500) NOT NULL,
        "attribution" varchar(500) DEFAULT NULL,
        "description" text,
        "notes" text,
        "list_category_id" int(11) DEFAULT NULL,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_lists_routes_pages1_idx" ("page_id"),
        KEY "fk_list_of_routes_list_category1_idx" ("list_category_id"),
        CONSTRAINT "fk_list_of_routes_list_category1"
          FOREIGN KEY ("list_category_id")
          REFERENCES "list_category" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_routes_pages1"
          FOREIGN KEY ("page_id")
          REFERENCES "page" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=24`
    );

    // === Feature/Route Elements ===
    // geography_region
    // gis_marker_route
    // location
    // map_resource
    // page
    // photo
    await client.query(
      `CREATE TABLE "peak_or_feature" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(100) NOT NULL,
        "names_other" varchar(100) DEFAULT NULL,
        "sub_feature_name" varchar(100) DEFAULT NULL,
        "summary_description" text,
        "description" text,
        "star_rating" float DEFAULT NULL
          COMMENT 'Rating out of 1.0',
        "location_id" int(11) DEFAULT NULL
          COMMENT 'TODO: Make not null once all filled in and once country is not null in location id.',
        "geography_region_id" int(11) DEFAULT NULL,
        "feature_type_id" int(11) DEFAULT NULL,
        "location_type_id" int(11) DEFAULT NULL,
        "gis_marker_route_id" int(11) DEFAULT NULL,
        "gis_marker_route_type_id" int(11) DEFAULT '1',
        "page_id" int(11) DEFAULT NULL,
        "photo_id" int(11) DEFAULT NULL,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        "map_resources_id" int(11) DEFAULT NULL,
        "feature_latitude" float DEFAULT NULL
          COMMENT 'TODO: Remove. Decimal degrees.',
        "feature_longitude" float DEFAULT NULL
          COMMENT 'TODO: Remove. Decimal degrees.',
        "feature_elevation" float DEFAULT NULL
          COMMENT 'TODO: Remove. Feet.',
        PRIMARY KEY ("id"),
        KEY "fk_peak_or_feature_pages1_idx" ("page_id"),
        KEY "fk_peak_or_feature_map_resources1_idx" ("map_resources_id"),
        KEY "fk_peak_or_feature_feature_location_type1_idx" ("location_type_id"),
        KEY "fk_peak_or_feature_feature_type1_idx" ("feature_type_id"),
        KEY "fk_peak_or_feature_locations1_idx" ("location_id"),
        KEY "fk_peak_or_feature_photos1_idx" ("photo_id"),
        KEY "fk_peak_or_feature_gis_marker_route1_idx" ("gis_marker_route_id","gis_marker_route_type_id"),
        KEY "fk_peak_or_feature_geography_region1_idx" ("geography_region_id"),
        CONSTRAINT "fk_peak_or_feature_feature_location_type1"
          FOREIGN KEY ("location_type_id")
          REFERENCES "feature_location_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_feature_type1"
          FOREIGN KEY ("feature_type_id")
          REFERENCES "feature_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_geography_region1"
          FOREIGN KEY ("geography_region_id")
          REFERENCES "geography_region" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_gis_marker_route1"
          FOREIGN KEY ("gis_marker_route_id", "gis_marker_route_type_id")
          REFERENCES "gis_marker_route" ("id", "gis_marker_route_type_id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_locations1"
          FOREIGN KEY ("location_id")
          REFERENCES "location" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_pages1"
          FOREIGN KEY ("page_id")
          REFERENCES "page" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_photos1"
          FOREIGN KEY ("photo_id")
          REFERENCES "photo" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=1307
        COMMENT='Programmatically move latitude, longitude, elevation to gis_marker_route and remove columns here.';
      `
    );

    // climbing_rack
    // photo
    // map_resource
    // page
    await client.query(
      `CREATE TABLE "climbing_route" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "route_id" int(11) NOT NULL,
        "variation_id" int(11) DEFAULT NULL,
        "name" varchar(100) NOT NULL,
        "name_other" varchar(100) DEFAULT NULL,
        "variation_name" varchar(100) DEFAULT NULL,
        "climbing_technical_rating_id" int(11) DEFAULT NULL COMMENT 'Note that this is manually assigned so that a route can exist wihtout a path. If the route is later associated with a path, this value can be derived from the path or pitches. Take care that these stay in sync.',
        "description" text,
        "peak_or_feature_id" int(11) DEFAULT NULL,
        "crag_id" int(11) DEFAULT NULL,
        "climbing_gym_id" int(11) DEFAULT NULL,
        "climbing_rack_id" int(11) DEFAULT NULL COMMENT 'Rack can be calculated by stating or enveloping at: pitch, path segment, climbing route, or the overwrites for each of these.',
        "star_rating" float DEFAULT NULL COMMENT 'Rating out of 1.0',
        "travel_style_id" int(11) DEFAULT NULL COMMENT 'Length style includes approach and descent.',
        "is_technical" tinyint(1) DEFAULT NULL,
        "is_seasonal_snow" tinyint(1) DEFAULT NULL,
        "traverse_id" int(11) DEFAULT NULL,
        "page_id" int(11) DEFAULT NULL,
        "photo_id" int(11) DEFAULT NULL,
        "map_resources_id" int(11) DEFAULT NULL,
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        UNIQUE KEY "unique_route_idx" ("route_id","variation_id"),
        UNIQUE KEY "traverse_id_UNIQUE" ("traverse_id"),
        KEY "fk_routes_map_resources1_idx" ("map_resources_id"),
        KEY "fk_routes_pages1_idx" ("page_id"),
        KEY "fk_routes_travel_styles1_idx" ("travel_style_id"),
        KEY "fk_route_photos1_idx" ("photo_id"),
        KEY "fk_route_climbing_gym1_idx" ("climbing_gym_id"),
        KEY "fk_route_crag1_idx" ("crag_id"),
        KEY "fk_route_peak_or_feature1_idx" ("peak_or_feature_id"),
        KEY "fk_climbing_route_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_climbing_route_climbing_technical_rating1_idx" ("climbing_technical_rating_id"),
        CONSTRAINT "fk_climbing_route_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_route_climbing_technical_rating1"
          FOREIGN KEY ("climbing_technical_rating_id")
          REFERENCES "climbing_technical_rating" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_climbing_gym1"
          FOREIGN KEY ("climbing_gym_id")
          REFERENCES "climbing_gym" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_crag1"
          FOREIGN KEY ("crag_id")
          REFERENCES "climbing_crag" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_peak_or_feature1"
          FOREIGN KEY ("peak_or_feature_id")
          REFERENCES "peak_or_feature" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_photos1"
          FOREIGN KEY ("photo_id")
          REFERENCES "photo" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_routes_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_routes_pages1"
          FOREIGN KEY ("page_id")
          REFERENCES "page" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_routes_travel_styles1"
          FOREIGN KEY ("travel_style_id")
          REFERENCES "climbing_travel_style" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=2243`
    );

    await client.query(
      `CREATE TABLE "climbing_route_misc_data" (
        "route_id" int(11) NOT NULL,
        "month_start_1" int(11) DEFAULT NULL,
        "month_end_1" int(11) DEFAULT NULL,
        "month_start_2" int(11) DEFAULT NULL,
        "month_end_2" int(11) DEFAULT NULL,
        "time_total_min" int(11) DEFAULT NULL COMMENT '(hrs)\nApproach, ascent, descent, deproach',
        "time_total_max" int(11) DEFAULT NULL COMMENT '(hrs)\nApproach, ascent, descent, deproach',
        "time_ascent_min" int(11) DEFAULT NULL COMMENT '(hrs)\nFrom TH or High Camp (if exists)',
        "time_ascent_max" int(11) DEFAULT NULL COMMENT '(hrs)\nFrom TH or High Camp (if exists)',
        "time_descent_min" int(11) DEFAULT NULL COMMENT '(hrs)\nTo TH or High Camp (if exists)\nTime does not apply to carryover',
        "time_descent_max" int(11) DEFAULT NULL COMMENT '(hrs)\nTo TH or High Camp (if exists)\nTime does not apply to carryover',
        "high_camp_id" int(11) DEFAULT NULL,
        "alternate_ascent_end" varchar(100) DEFAULT NULL COMMENT 'Assumed to top of feature if not specified.',
        "descent_route_id" int(11) DEFAULT NULL,
        "carryover_route_id" int(11) DEFAULT NULL,
        "pitches_total_min" int(11) DEFAULT NULL,
        "pitches_total_max" int(11) DEFAULT NULL,
        "rappels_total" int(11) DEFAULT NULL,
        "notes_toprope" text,
        "notes" text,
        PRIMARY KEY ("route_id"),
        KEY "fk_route_misc_data_camp1_idx" ("high_camp_id"),
        KEY "fk_route_misc_data_route2_idx" ("descent_route_id"),
        KEY "fk_route_misc_data_route3_idx" ("carryover_route_id"),
        CONSTRAINT "fk_route_misc_data_camp1"
          FOREIGN KEY ("high_camp_id")
          REFERENCES "camp" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_misc_data_route1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_misc_data_route2"
          FOREIGN KEY ("descent_route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_misc_data_route3"
          FOREIGN KEY ("carryover_route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_overwrite" (
        "route_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        "technical_rating_id" int(11) DEFAULT NULL,
        "climbing_rack_id" int(11) DEFAULT NULL,
        "pitch_id" int(11) DEFAULT NULL,
        "star_rating" float DEFAULT NULL,
        "notes" text,
        PRIMARY KEY ("reference_id","route_id"),
        KEY "fk_route_overwrites_routes1_idx" ("route_id"),
        KEY "fk_route_overwrites_technical_rating1_idx" ("technical_rating_id"),
        KEY "fk_route_overwrites_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_route_overwrites_pitches1_idx" ("pitch_id"),
        KEY "fk_climbing_route_overwrite_reference1_idx" ("reference_id"),
        CONSTRAINT "fk_climbing_route_overwrite_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_overwrites_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_overwrites_pitches1"
          FOREIGN KEY ("pitch_id")
          REFERENCES "climbing_route_pitch" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_overwrites_routes1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_overwrites_technical_rating1"
          FOREIGN KEY ("technical_rating_id")
          REFERENCES "climbing_technical_rating" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_rock_style_attribute_grade" (
        "route_id" int(11) NOT NULL,
        "chimney_grade_id" int(11) DEFAULT NULL,
        "squeeze_grade_id" int(11) DEFAULT NULL,
        "offwidth_grade_id" int(11) DEFAULT NULL,
        "flare_grade_id" int(11) DEFAULT NULL,
        "fist_grade_id" int(11) DEFAULT NULL,
        "hand_grade_id" int(11) DEFAULT NULL,
        "finger_grade_id" int(11) DEFAULT NULL,
        "lieback_grade_id" int(11) DEFAULT NULL,
        "face_grade_id" int(11) DEFAULT NULL,
        "friction_grade_id" int(11) DEFAULT NULL,
        "roof_grade_id" int(11) DEFAULT NULL,
        "runout_grade_id" int(11) DEFAULT NULL,
        "x_grade_id" int(11) DEFAULT NULL,
        "approach_grade_id" int(11) DEFAULT NULL,
        "top_rope_access_grade_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("route_id"),
        KEY "fk_route_type_grade_grade_yds1_idx" ("chimney_grade_id"),
        KEY "fk_route_type_grade_grade_yds2_idx" ("squeeze_grade_id"),
        KEY "fk_route_type_grade_grade_yds3_idx" ("offwidth_grade_id"),
        KEY "fk_route_type_grade_grade_yds4_idx" ("flare_grade_id"),
        KEY "fk_route_type_grade_grade_yds5_idx" ("fist_grade_id"),
        KEY "fk_route_type_grade_grade_yds6_idx" ("hand_grade_id"),
        KEY "fk_route_type_grade_grade_yds7_idx" ("finger_grade_id"),
        KEY "fk_route_type_grade_grade_yds8_idx" ("lieback_grade_id"),
        KEY "fk_route_type_grade_grade_yds9_idx" ("face_grade_id"),
        KEY "fk_route_type_grade_grade_yds10_idx" ("friction_grade_id"),
        KEY "fk_route_type_grade_grade_yds11_idx" ("roof_grade_id"),
        KEY "fk_route_type_grade_grade_yds12_idx" ("runout_grade_id"),
        KEY "fk_route_type_grade_grade_yds13_idx" ("x_grade_id"),
        KEY "fk_route_type_grade_grade_yds14_idx" ("approach_grade_id"),
        KEY "fk_route_type_grade_grade_yds15_idx" ("top_rope_access_grade_id"),
        CONSTRAINT "fk_route_type_grade_grade_yds1"
          FOREIGN KEY ("chimney_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds10"
          FOREIGN KEY ("friction_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds11"
          FOREIGN KEY ("roof_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds12"
          FOREIGN KEY ("runout_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds13"
          FOREIGN KEY ("x_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds14"
          FOREIGN KEY ("approach_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds15"
          FOREIGN KEY ("top_rope_access_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds2"
          FOREIGN KEY ("squeeze_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds3"
          FOREIGN KEY ("offwidth_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds4"
          FOREIGN KEY ("flare_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds5"
          FOREIGN KEY ("fist_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds6"
          FOREIGN KEY ("hand_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds7"
          FOREIGN KEY ("finger_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds8"
          FOREIGN KEY ("lieback_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_grade_yds9"
          FOREIGN KEY ("face_grade_id")
          REFERENCES "grade_yds" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_type_grade_route1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) COMMENT='These are grades given to each style of climbing on the route, if it is noteworthy for the overall route style. By default this should be the route yds grade unless known to be otherwise.';
      `
    );

    // === topo ===
    // status
    await client.query(
      `CREATE TABLE "climbing_route_topo" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "title" varchar(100) NOT NULL,
        "url" varchar(200) DEFAULT NULL,
        "tasks" text,
        "status_id" int(11) NOT NULL DEFAULT '1',
        "is_public" tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"),
        KEY "fk_route_topos_status1_idx" ("status_id"),
        CONSTRAINT "fk_route_topos_status1"
          FOREIGN KEY ("status_id")
          REFERENCES "status" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // === Path Sequence ===
    await client.query(
      `CREATE TABLE "path_sequence" (
        "id" int(11) NOT NULL,
        "name" varchar(45) DEFAULT NULL,
        "description" text,
        "climbing_rating_envelope" varchar(100) DEFAULT NULL
          COMMENT 'Determined programmatically.',
        "climbing_rack_envelope" varchar(200) DEFAULT NULL
          COMMENT 'Determined programmatically.',
        PRIMARY KEY ("id")
      )`
    );

    await client.query(
      `CREATE TABLE "path_route_sequence" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "path_sequence_id" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "path_sequence_id_UNIQUE" ("path_sequence_id","id"),
        KEY "fk_path_route_sequence_path_sequence1_idx" ("path_sequence_id"),
        CONSTRAINT "fk_path_route_sequence_path_sequence1"
          FOREIGN KEY ("path_sequence_id")
          REFERENCES "path_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "path_descent_sequence" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "path_sequence_id" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_path_route_sequence_path_sequence1_idx" ("path_sequence_id"),
        CONSTRAINT "fk_path_route_sequence_path_sequence100"
          FOREIGN KEY ("path_sequence_id")
          REFERENCES "path_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "path_deproach_sequence" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "path_sequence_id" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_path_route_sequence_path_sequence1_idx" ("path_sequence_id"),
        CONSTRAINT "fk_path_route_sequence_path_sequence1000"
          FOREIGN KEY ("path_sequence_id")
          REFERENCES "path_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "path_approach_sequence" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "path_sequence_id" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_path_route_sequence_path_sequence1_idx" ("path_sequence_id"),
        CONSTRAINT "fk_path_route_sequence_path_sequence10"
          FOREIGN KEY ("path_sequence_id")
          REFERENCES "path_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // climbing_rack
    await client.query(
      `CREATE TABLE "path_segment_climbing" (
        "id" int(11) NOT NULL,
        "technical_rating_id" int(11) NOT NULL,
        "climbing_rack_id" int(11) DEFAULT NULL,
        "number_of_pitches" int(11) DEFAULT NULL
          COMMENT 'Summation from list.\n',
        "pitch_notes" text
          COMMENT 'Combine all pitch descriptions\n',
        "pitch_max_length" int(11) DEFAULT NULL
          COMMENT 'Meters. Max from list\n',
        "number_of_rappels" int(11) DEFAULT NULL
          COMMENT 'Summation from list.\n',
        "rappel_max_length" int(11) DEFAULT NULL
           COMMENT 'Meters. Max from list.\n',
        "rappel_bypass_technical_rating_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_path_segments_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_path_segment_climbing_climbing_technical_rating1_idx" ("technical_rating_id"),
        KEY "fk_path_segment_climbing_climbing_technical_rating2_idx" ("rappel_bypass_technical_rating_id"),
        CONSTRAINT "fk_path_segment_climbing_climbing_technical_rating1"
          FOREIGN KEY ("technical_rating_id")
          REFERENCES "climbing_technical_rating" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_segment_climbing_climbing_technical_rating2"
          FOREIGN KEY ("rappel_bypass_technical_rating_id")
          REFERENCES "climbing_technical_rating" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_segments_climbing_rack10"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) `
    );

    // climbing_rack
    await client.query(
      `CREATE TABLE "climbing_route_pitch" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "technical_rating_id" int(11) DEFAULT NULL,
        "climbing_rack_id" int(11) DEFAULT NULL,
        "description" text,
        "length" int(11) DEFAULT NULL COMMENT 'Meters',
        "pitch_rappels_number" int(11) DEFAULT NULL,
        "pitch_max_rappel_length" int(11) DEFAULT NULL COMMENT 'Meters',
        PRIMARY KEY ("id"),
        KEY "fk_pitches_technical_rating1_idx" ("technical_rating_id"),
        KEY "fk_pitches_climbing_rack1_idx" ("climbing_rack_id"),
        CONSTRAINT "fk_pitches_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_pitches_technical_rating1"
          FOREIGN KEY ("technical_rating_id")
          REFERENCES "climbing_technical_rating" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      ``
    );

    // === Path Set ===
    await client.query(
      `CREATE TABLE "path_set" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "trailhead_start_id" int(11) NOT NULL,
        "path_approach_id" int(11) NOT NULL,
        "path_deproach_id" int(11) NOT NULL,
        "trailhead_finish_id" int(11) NOT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_path_set_objective_singular_trailhead1_idx" ("trailhead_start_id"),
        KEY "fk_path_set_objective_singular_trailhead2_idx" ("trailhead_finish_id"),
        KEY "fk_path_set_objective_singular_path_deproach_sequence1_idx" ("path_deproach_id"),
        KEY "fk_path_set_objective_multi_path_approach_sequence1_idx" ("path_approach_id"),
        CONSTRAINT "fk_path_set_objective_multi_path_approach_sequence1"
          FOREIGN KEY ("path_approach_id")
          REFERENCES "path_approach_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_singular_path_deproach_sequence1000"
          FOREIGN KEY ("path_deproach_id")
          REFERENCES "path_deproach_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_singular_trailhead1000"
          FOREIGN KEY ("trailhead_start_id")
          REFERENCES "trailhead" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_singular_trailhead2000"
          FOREIGN KEY ("trailhead_finish_id")
          REFERENCES "trailhead" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "path_set_by_day" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "day_number" int(11) DEFAULT NULL,
        "camp_id" int(11) DEFAULT NULL,
        "path_set_id" int(11) NOT NULL,
        "path_set_index_start" int(11) DEFAULT NULL COMMENT 'Index in the sequence for the last lat/long that coincides with a camp location.',
        "path_set_index_end" int(11) DEFAULT NULL COMMENT 'Index in the sequence for the next lat/long that coincides with a camp location.',
        PRIMARY KEY ("id"),
        KEY "fk_path_set_by_day_camp1_idx" ("camp_id"),
        KEY "fk_path_set_by_day_path_set1_idx" ("path_set_id"),
        CONSTRAINT "fk_path_set_by_day_camp1"
          FOREIGN KEY ("camp_id")
          REFERENCES "camp" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_by_day_path_set1"
          FOREIGN KEY ("path_set_id")
          REFERENCES "path_set" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "path_set_component" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "path_approach_id" int(11) DEFAULT NULL,
        "path_approach_route_id" int(11) DEFAULT NULL COMMENT 'Traverse routes only.',
        "path_descent_route_id" int(11) DEFAULT NULL,
        "path_descent_id" int(11) DEFAULT NULL,
        "path_deproach_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_path_set_objective_singular_path_approach_sequence1_idx" ("path_approach_id"),
        KEY "fk_path_set_objective_singular_path_route_sequence1_idx" ("path_approach_route_id"),
        KEY "fk_path_set_objective_singular_path_descent_sequence1_idx" ("path_descent_id"),
        KEY "fk_path_set_objective_component_path_route_sequence1_idx" ("path_descent_route_id"),
        KEY "fk_path_set_objective_component_path_deproach_sequence1_idx" ("path_deproach_id"),
        CONSTRAINT "fk_path_set_objective_component_path_deproach_sequence1"
          FOREIGN KEY ("path_deproach_id")
          REFERENCES "path_deproach_sequence" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_component_path_route_sequence1"
          FOREIGN KEY ("path_descent_route_id")
          REFERENCES "path_route_sequence" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_singular_path_approach_sequence11"
          FOREIGN KEY ("path_approach_id")
          REFERENCES "path_approach_sequence" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_singular_path_descent_sequence11"
          FOREIGN KEY ("path_descent_id")
          REFERENCES "path_descent_sequence" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_singular_path_route_sequence11"
          FOREIGN KEY ("path_approach_route_id")
          REFERENCES "path_route_sequence" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )`
    );

    // === Trips ===
    await client.query(
      `CREATE TABLE "trip_day_overwrite_to_route" (
        "route_id" int(11) NOT NULL,
        "day_id" int(11) NOT NULL,
        "technical_rating_id" int(11) DEFAULT NULL,
        "climbing_rack_id" int(11) DEFAULT NULL,
        "pitch_id" int(11) DEFAULT NULL,
        "star_rating" float DEFAULT NULL,
        "is_technical" tinyint(1) DEFAULT NULL,
        "travel_style_id" int(11) DEFAULT NULL,
        "trip_route_method_id" int(11) DEFAULT NULL,
        "notes" text,
        PRIMARY KEY ("route_id","day_id"),
        KEY "fk_day_to_route_overwrites_routes1_idx" ("route_id"),
        KEY "fk_day_to_route_overwrites_day_stats1_idx" ("day_id"),
        KEY "fk_day_to_route_overwrites_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_day_to_route_overwrites_technical_rating1_idx" ("technical_rating_id"),
        KEY "fk_day_overwrites_to_route_route_trip_methods1_idx" ("trip_route_method_id"),
        KEY "fk_day_overwrites_to_route_travel_styles1_idx" ("travel_style_id"),
        KEY "fk_trip_day_overwrite_to_route_climbing_route_pitch1_idx" ("pitch_id"),
        CONSTRAINT "fk_day_overwrites_to_route_route_trip_methods1"
          FOREIGN KEY ("trip_route_method_id")
          REFERENCES "trip_route_method" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_day_overwrites_to_route_travel_styles1"
          FOREIGN KEY ("travel_style_id")
          REFERENCES "climbing_travel_style" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_day_to_route_overwrites_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_day_to_route_overwrites_day_stats1"
          FOREIGN KEY ("day_id")
          REFERENCES "trip_by_day" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_day_to_route_overwrites_routes1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_day_to_route_overwrites_technical_rating1"
          FOREIGN KEY ("technical_rating_id")
          REFERENCES "climbing_technical_rating" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_day_overwrite_to_route_climbing_route_pitch1"
          FOREIGN KEY ("pitch_id")
          REFERENCES "climbing_route_pitch" ("id")
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
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}