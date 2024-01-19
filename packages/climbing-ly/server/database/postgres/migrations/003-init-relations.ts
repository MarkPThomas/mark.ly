export class InitRelations003 {
  public async up(client): Promise<void> {
    // reference
    await client.query(
      `CREATE TABLE "list_of_features_has_reference" (
        "list_of_features_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("list_of_features_id","reference_id"),
        KEY "fk_list_of_features_has_reference_reference1_idx" ("reference_id"),
        KEY "fk_list_of_features_has_reference_list_of_features1_idx" ("list_of_features_id"),
        CONSTRAINT "fk_list_of_features_has_reference_list_of_features1"
          FOREIGN KEY ("list_of_features_id")
          REFERENCES "list_of_features" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_list_of_features_has_reference_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );


    // === Feature/Route Elements ===
    // reference
    await client.query(
      `CREATE TABLE "list_of_routes_has_reference" (
        "list_of_routes_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("list_of_routes_id","reference_id"),
        KEY "fk_list_of_routes_has_reference_reference1_idx" ("reference_id"),
        KEY "fk_list_of_routes_has_reference_list_of_routes1_idx" ("list_of_routes_id"),
        CONSTRAINT "fk_list_of_routes_has_reference_list_of_routes1"
          FOREIGN KEY ("list_of_routes_id")
          REFERENCES "list_of_routes" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_list_of_routes_has_reference_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) `
    );

    await client.query(
      `CREATE TABLE "list_to_internal_category" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "list_category_id" int(11) NOT NULL,
        "list_category_sub_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        UNIQUE KEY "unique_category_idx" ("list_category_id","list_category_sub_id"),
        KEY "fk_region_to_sub_external_list_category_sub1_idx" ("list_category_sub_id"),
        KEY "fk_region_to_sub_external_list_category1_idx" ("list_category_id"),
        CONSTRAINT "fk_region_to_sub_external_list_category1"
          FOREIGN KEY ("list_category_id")
          REFERENCES "list_internal_category" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_region_to_sub_external_list_category_sub1"
          FOREIGN KEY ("list_category_sub_id")
          REFERENCES "list_internal_category_sub" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=97`
    );

    // photo
    // map_resource
    await client.query(
      `CREATE TABLE "list_to_climbing_route" (
        "route_id" int(11) NOT NULL,
        "route_list_id" int(11) NOT NULL,
        "description" text,
        "complete_region_id" int(11) DEFAULT NULL,
        "photo_id" int(11) DEFAULT NULL,
        "map_resources_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("route_id","route_list_id"),
        KEY "fk_lists_to_routes_lists_routes1_idx" ("route_list_id"),
        KEY "fk_lists_to_routes_map_resources1_idx" ("map_resources_id"),
        KEY "fk_list_to_route_list_region_has_list_region_sub1_idx" ("complete_region_id"),
        KEY "fk_list_to_climbing_route_photo1_idx" ("photo_id"),
        CONSTRAINT "fk_list_to_climbing_route_photo1"
          FOREIGN KEY ("photo_id")
          REFERENCES "photo" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_list_to_route_list_region_has_list_region_sub1"
          FOREIGN KEY ("complete_region_id")
          REFERENCES "list_to_internal_category" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_to_routes_lists_routes1"
          FOREIGN KEY ("route_list_id")
          REFERENCES "list_of_routes" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_to_routes_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_to_routes_routes1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // photo
    // map_resource
    await client.query(
      `CREATE TABLE "list_to_feature" (
        "peak_or_feature_id" int(11) NOT NULL,
        "feature_list_id" int(11) NOT NULL,
        "description" text,
        "complete_region_id" int(11) DEFAULT NULL,
        "photo_id" int(11) DEFAULT NULL,
        "map_resources_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("peak_or_feature_id","feature_list_id"),
        KEY "fk_lists_to_features_peak_or_feature1_idx" ("peak_or_feature_id"),
        KEY "fk_lists_to_features_lists_features1_idx" ("feature_list_id"),
        KEY "fk_lists_to_features_map_resources1_idx" ("map_resources_id"),
        KEY "fk_list_to_feature_list_region_has_list_region_sub1_idx" ("complete_region_id"),
        KEY "fk_list_to_feature_photo1_idx" ("photo_id"),
        CONSTRAINT "fk_list_to_feature_list_region_has_list_region_sub1"
          FOREIGN KEY ("complete_region_id")
          REFERENCES "list_to_internal_category" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_list_to_feature_photo1"
          FOREIGN KEY ("photo_id")
          REFERENCES "photo" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_to_features_lists_features1"
          FOREIGN KEY ("feature_list_id")
          REFERENCES "list_of_features" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_to_features_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_lists_to_features_peak_or_feature1"
          FOREIGN KEY ("peak_or_feature_id")
          REFERENCES "peak_or_feature" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // === Feature/Route Elements ===
    await client.query(
      `CREATE TABLE "peak_or_feature_has_list_of_custom_ticks" (
        "peak_or_feature_id" int(11) NOT NULL,
        "list_of_custom_ticks_id" int(11) NOT NULL,
        PRIMARY KEY ("peak_or_feature_id","list_of_custom_ticks_id"),
        KEY "fk_peak_or_feature_has_list_of_custom_ticks_list_of_custom__idx" ("list_of_custom_ticks_id"),
        KEY "fk_peak_or_feature_has_list_of_custom_ticks_peak_or_feature_idx" ("peak_or_feature_id"),
        CONSTRAINT "fk_peak_or_feature_has_list_of_custom_ticks_list_of_custom_ti1"
          FOREIGN KEY ("list_of_custom_ticks_id")
          REFERENCES "list_of_custom_ticks" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_has_list_of_custom_ticks_peak_or_feature1"
          FOREIGN KEY ("peak_or_feature_id")
          REFERENCES "peak_or_feature" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "peak_or_feature_has_feature_characteristic" (
        "peak_or_feature_id" int(11) NOT NULL,
        "feature_characteristic_id" int(11) NOT NULL,
        PRIMARY KEY ("peak_or_feature_id","feature_characteristic_id"),
        KEY "fk_feature_characteristic_has_peak_or_feature_peak_or_featu_idx" ("peak_or_feature_id"),
        KEY "fk_feature_characteristic_has_peak_or_feature_feature_chara_idx" ("feature_characteristic_id"),
        CONSTRAINT "fk_feature_characteristic_has_peak_or_feature_feature_charact1"
          FOREIGN KEY ("feature_characteristic_id")
          REFERENCES "feature_characteristic" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_feature_characteristic_has_peak_or_feature_peak_or_feature1"
          FOREIGN KEY ("peak_or_feature_id")
          REFERENCES "peak_or_feature" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) `
    );

    // reference
    await client.query(
      `CREATE TABLE "peak_or_feature_has_reference" (
        "peak_or_feature_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("peak_or_feature_id","reference_id"),
        KEY "fk_peak_or_feature_has_references_offline_references_offlin_idx" ("reference_id"),
        KEY "fk_peak_or_feature_has_references_offline_peak_or_feature1_idx" ("peak_or_feature_id"),
        CONSTRAINT "fk_peak_or_feature_has_references_offline_peak_or_feature1"
          FOREIGN KEY ("peak_or_feature_id")
          REFERENCES "peak_or_feature" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_has_references_offline_references_offline1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) `
    );

    // === Path Set ===
    await client.query(
      `CREATE TABLE "path_set_component_has_path_route_sequence" (
        "objective_component_id" int(11) NOT NULL,
        "path_route_id" int(11) NOT NULL,
        PRIMARY KEY ("objective_component_id","path_route_id"),
        KEY "fk_path_set_objective_component_has_path_route_sequence_pat_idx" ("path_route_id"),
        KEY "fk_path_set_objective_component_has_path_route_sequence_pat_idx1" ("objective_component_id"),
        CONSTRAINT "fk_path_set_objective_component_has_path_route_sequence_path_1"
          FOREIGN KEY ("objective_component_id")
          REFERENCES "path_set_component" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_component_has_path_route_sequence_path_2"
          FOREIGN KEY ("path_route_id")
          REFERENCES "path_route_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "path_set_has_path_set_component" (
        "path_set_id" int(11) NOT NULL,
        "objective_component_id" int(11) NOT NULL,
        PRIMARY KEY ("path_set_id","objective_component_id"),
        KEY "fk_path_set_objective_component_has_path_set_objective_mult_idx" ("path_set_id"),
        KEY "fk_path_set_objective_component_has_path_set_objective_mult_idx1" ("objective_component_id"),
        CONSTRAINT "fk_path_set_objective_component_has_path_set_objective_multi_1"
          FOREIGN KEY ("objective_component_id")
          REFERENCES "path_set_component" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_set_objective_component_has_path_set_objective_multi_2"
          FOREIGN KEY ("path_set_id")
          REFERENCES "path_set" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // === Path Segment ===
    await client.query(
      `CREATE TABLE "path_segment_has_path_sequence" (
        "path_segment_id" int(11) NOT NULL,
        "path_sequence_id" int(11) NOT NULL,
        "sequence_number" int(11) NOT NULL COMMENT 'The number/order in a given sequence',
        "is_segment_reversed" tinyint(1) NOT NULL DEFAULT '1',
        PRIMARY KEY ("path_segment_id","path_sequence_id"),
        UNIQUE KEY "location_sequence_idx" ("path_segment_id","path_sequence_id","sequence_number","is_segment_reversed"),
        KEY "fk_path_segment_has_path_sequence_path_sequence1_idx" ("path_sequence_id"),
        KEY "fk_path_segment_has_path_sequence_path_segment1_idx" ("path_segment_id"),
        CONSTRAINT "fk_path_segment_has_path_sequence_path_segment1"
          FOREIGN KEY ("path_segment_id")
          REFERENCES "path_segment" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_path_segment_has_path_sequence_path_sequence1"
          FOREIGN KEY ("path_sequence_id")
          REFERENCES "path_sequence" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_path_segment_has_pitch" (
        "climbing_segment_id" int(11) NOT NULL,
        "pitch_id" int(11) NOT NULL,
        "pitch_sequence" int(11) NOT NULL,
        PRIMARY KEY ("climbing_segment_id","pitch_id"),
        UNIQUE KEY "location_sequence_idx" ("pitch_id","climbing_segment_id","pitch_sequence"),
        KEY "fk_pitches_has_path_segments_pitches1_idx" ("pitch_id"),
        KEY "fk_climbing_route_pitch_to_path_segment_path_segment_climbi_idx" ("climbing_segment_id"),
        CONSTRAINT "fk_climbing_route_pitch_to_path_segment_path_segment_climbing1"
          FOREIGN KEY ("climbing_segment_id")
          REFERENCES "path_segment_climbing" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_pitches_has_path_segments_pitches1"
          FOREIGN KEY ("pitch_id")
          REFERENCES "climbing_route_pitch" ("id")
          ON DELETE CASCADE
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

    await client.query(
      ``
    );

    await client.query(
      `CREATE TABLE "climbing_route_has_list_of_custom_ticks" (
        "climbing_route_id" int(11) NOT NULL,
        "list_of_custom_ticks_id" int(11) NOT NULL,
        PRIMARY KEY ("climbing_route_id","list_of_custom_ticks_id"),
        KEY "fk_climbing_route_has_list_of_custom_ticks_list_of_custom_t_idx" ("list_of_custom_ticks_id"),
        KEY "fk_climbing_route_has_list_of_custom_ticks_climbing_route1_idx" ("climbing_route_id"),
        CONSTRAINT "fk_climbing_route_has_list_of_custom_ticks_climbing_route1"
          FOREIGN KEY ("climbing_route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_route_has_list_of_custom_ticks_list_of_custom_tic1"
          FOREIGN KEY ("list_of_custom_ticks_id")
          REFERENCES "list_of_custom_ticks" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_has_objective_hazard" (
        "climbing_route_id" int(11) NOT NULL,
        "objective_hazard_id" int(11) NOT NULL,
        PRIMARY KEY ("climbing_route_id","objective_hazard_id"),
        KEY "fk_climbing_route_has_objective_hazard_objective_hazard1_idx" ("objective_hazard_id"),
        KEY "fk_climbing_route_has_objective_hazard_climbing_route1_idx" ("climbing_route_id"),
        CONSTRAINT "fk_climbing_route_has_objective_hazard_climbing_route1"
          FOREIGN KEY ("climbing_route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_route_has_objective_hazard_objective_hazard1"
          FOREIGN KEY ("objective_hazard_id")
          REFERENCES "objective_hazard" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_has_path_sequence" (
        "route_id" int(11) NOT NULL,
        "path_sequence_id" int(11) NOT NULL,
        "is_core_route" tinyint(1) NOT NULL DEFAULT '1',
        PRIMARY KEY ("route_id","path_sequence_id"),
        KEY "fk_route_has_path_route_route1_idx" ("route_id"),
        KEY "fk_climbing_route_has_path_sequence_path_route_sequence1_idx" ("path_sequence_id"),
        CONSTRAINT "fk_climbing_route_has_path_sequence_path_route_sequence1"
          FOREIGN KEY ("path_sequence_id")
          REFERENCES "path_route_sequence" ("path_sequence_id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_route_has_path_route_route1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_has_reference" (
        "reference_id" int(11) NOT NULL,
        "route_id" int(11) NOT NULL,
        PRIMARY KEY ("reference_id","route_id"),
        KEY "fk_routes_to_references_offline_routes1_idx" ("route_id"),
        CONSTRAINT "fk_routes_to_references_offline_references_offline1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_routes_to_references_offline_routes1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
      COMMENT='Any references that relate to the route.'`
    );

    await client.query(
      `CREATE TABLE "climbing_route_has_route_characteristic_rock" (
        "route_id" int(11) NOT NULL,
        "route_characteristic_rock_id" int(11) NOT NULL,
        PRIMARY KEY ("route_id","route_characteristic_rock_id"),
        KEY "fk_routes_has_route_characteristics_rock_route_characterist_idx" ("route_characteristic_rock_id"),
        KEY "fk_routes_has_route_characteristics_rock_routes1_idx" ("route_id"),
        CONSTRAINT "fk_routes_has_route_characteristics_rock_route_characteristic1"
          FOREIGN KEY ("route_characteristic_rock_id")
          REFERENCES "climbing_route_characteristic_rock" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_routes_has_route_characteristics_rock_routes1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_has_route_characteristic_snow_ice" (
        "route_id" int(11) NOT NULL,
        "characteristic_snow_ice_id" int(11) NOT NULL,
        PRIMARY KEY ("route_id","characteristic_snow_ice_id"),
        KEY "fk_routes_has_route_characteristics_snow_ice_route_characte_idx" ("characteristic_snow_ice_id"),
        KEY "fk_routes_has_route_characteristics_snow_ice_routes1_idx" ("route_id"),
        CONSTRAINT "fk_routes_has_route_characteristics_snow_ice_route_characteri1"
          FOREIGN KEY ("characteristic_snow_ice_id")
          REFERENCES "climbing_route_characteristic_snow_ice" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_routes_has_route_characteristics_snow_ice_routes1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_route_has_travel_mode" (
        "route_id" int(11) NOT NULL,
        "travel_mode_id" int(11) NOT NULL,
        PRIMARY KEY ("route_id","travel_mode_id"),
        KEY "fk_routes_has_travel_modes_travel_modes1_idx" ("travel_mode_id"),
        KEY "fk_routes_has_travel_modes_routes1_idx" ("route_id"),
        CONSTRAINT "fk_routes_has_travel_modes_routes1"
          FOREIGN KEY ("route_id")
          REFERENCES "climbing_route" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_routes_has_travel_modes_travel_modes1"
          FOREIGN KEY ("travel_mode_id")
          REFERENCES "travel_mode" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "traverse_route_has_peak_or_feature" (
        "traverse_id" int(11) NOT NULL,
        "sequence" int(11) NOT NULL,
        "peak_or_feature_id" int(11) NOT NULL,
        PRIMARY KEY ("traverse_id","peak_or_feature_id"),
        UNIQUE KEY "unique_traverse_sequence_idx" ("traverse_id","sequence"),
        KEY "fk_peak_or_feature_has_climbing_route_climbing_route1_idx" ("traverse_id"),
        KEY "fk_peak_or_feature_has_climbing_route_peak_or_feature1_idx" ("peak_or_feature_id"),
        CONSTRAINT "fk_peak_or_feature_has_climbing_route_climbing_route1"
          FOREIGN KEY ("traverse_id")
          REFERENCES "climbing_route" ("traverse_id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_peak_or_feature_has_climbing_route_peak_or_feature1"
          FOREIGN KEY ("peak_or_feature_id")
          REFERENCES "peak_or_feature" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
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