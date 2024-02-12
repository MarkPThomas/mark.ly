export class InitRelations003 {
  public async up(client): Promise<void> {
    // Camps & Trailheads
    await client.query(
      `CREATE TABLE "camp_has_objective_hazard" (
        "camp_id" int(11) NOT NULL,
        "objective_hazard_id" int(11) NOT NULL,
        PRIMARY KEY ("camp_id","objective_hazard_id"),
        KEY "fk_camp_has_objective_hazard_objective_hazard1_idx" ("objective_hazard_id"),
        KEY "fk_camp_has_objective_hazard_camp1_idx" ("camp_id"),
        CONSTRAINT "fk_camp_has_objective_hazard_camp1"
          FOREIGN KEY ("camp_id")
          REFERENCES "camp" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_camp_has_objective_hazard_objective_hazard1"
          FOREIGN KEY ("objective_hazard_id")
          REFERENCES "objective_hazard" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) `
    );

    await client.query(
      `CREATE TABLE "camp_has_reference" (
        "camp_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("camp_id","reference_id"),
        KEY "fk_camp_has_reference_reference1_idx" ("reference_id"),
        KEY "fk_camp_has_reference_camp1_idx" ("camp_id"),
        CONSTRAINT "fk_camp_has_reference_camp1"
          FOREIGN KEY ("camp_id")
          REFERENCES "camp" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_camp_has_reference_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "trailhead_has_reference" (
        "trailhead_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("trailhead_id","reference_id"),
        KEY "fk_trailheads_has_references_offline_references_offline1_idx" ("reference_id"),
        KEY "fk_trailheads_has_references_offline_trailheads1_idx" ("trailhead_id"),
        CONSTRAINT "fk_trailheads_has_references_offline_references_offline1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trailheads_has_references_offline_trailheads1"
          FOREIGN KEY ("trailhead_id")
          REFERENCES "trailhead" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "trailhead_has_trailhead_classification" (
        "trailhead_id" int(11) NOT NULL,
        "trailhead_classification_id" int(11) NOT NULL,
        PRIMARY KEY ("trailhead_id","trailhead_classification_id"),
        KEY "fk_trailhead_classifications_has_trailheads_trailheads1_idx" ("trailhead_id"),
        KEY "fk_trailhead_classifications_has_trailheads_trailhead_class_idx" ("trailhead_classification_id"),
        CONSTRAINT "fk_trailhead_classifications_has_trailheads_trailhead_classif1"
          FOREIGN KEY ("trailhead_classification_id")
          REFERENCES "trailhead_classification" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trailhead_classifications_has_trailheads_trailheads1"
          FOREIGN KEY ("trailhead_id")
          REFERENCES "trailhead" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    // === Trip ===
    await client.query(
      `CREATE TABLE "trip_has_reference" (
        "trip_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("trip_id","reference_id"),
        KEY "fk_trip_has_reference_reference1_idx" ("reference_id"),
        KEY "fk_trip_has_reference_trip1_idx" ("trip_id"),
        CONSTRAINT "fk_trip_has_reference_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "fk_trip_has_reference_trip1"
          FOREIGN KEY ("trip_id")
          REFERENCES "trip" ("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )`
    );

    await client.query(
      `CREATE TABLE "trip_has_trip_characteristic" (
        "trip_id" int(11) NOT NULL,
        "trip_characteristic_id" int(11) NOT NULL,
        PRIMARY KEY ("trip_id","trip_characteristic_id"),
        KEY "fk_trip_characteristics_has_trips_trips1_idx" ("trip_id"),
        KEY "fk_trip_characteristics_has_trips_trip_characteristics1_idx" ("trip_characteristic_id"),
        CONSTRAINT "fk_trip_characteristics_has_trips_trip_characteristics1"
          FOREIGN KEY ("trip_characteristic_id") REFERENCES "trip_characteristic" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_characteristics_has_trips_trips1"
          FOREIGN KEY ("trip_id") REFERENCES "trip" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "trip_by_day_has_reference" (
        "trip_by_day_id" int(11) NOT NULL,
        "reference_id" int(11) NOT NULL,
        PRIMARY KEY ("trip_by_day_id","reference_id"),
        KEY "fk_trip_by_day_has_reference_reference1_idx" ("reference_id"),
        KEY "fk_trip_by_day_has_reference_trip_by_day1_idx" ("trip_by_day_id"),
        CONSTRAINT "fk_trip_by_day_has_reference_reference1"
          FOREIGN KEY ("reference_id")
          REFERENCES "reference" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_trip_by_day_has_reference_trip_by_day1"
          FOREIGN KEY ("trip_by_day_id")
          REFERENCES "trip_by_day" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "partner_to_day" (
        "partner_id" int(11) NOT NULL,
        "day_id" int(11) NOT NULL,
        PRIMARY KEY ("partner_id","day_id"),
        KEY "fk_partners_has_day_stats_day_stats1_idx" ("day_id"),
        KEY "fk_partners_has_day_stats_partners1_idx" ("partner_id"),
        CONSTRAINT "fk_partners_has_day_stats_day_stats1"
          FOREIGN KEY ("day_id")
          REFERENCES "trip_by_day" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_partners_has_day_stats_partners1"
          FOREIGN KEY ("partner_id")
          REFERENCES "partner" ("id")
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
      ``
    );
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}