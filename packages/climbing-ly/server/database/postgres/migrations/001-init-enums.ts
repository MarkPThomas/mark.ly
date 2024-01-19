export class InitEnums001 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "tick_category" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=4`
    );

    // === Peak or Feature ===
    await client.query(
      `CREATE TABLE "feature_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=17`
    );

    await client.query(
      `CREATE TABLE "feature_location_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=9`
    );

    await client.query(
      `CREATE TABLE "feature_characteristic" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=3`
    );

    // === climbing ratings ===
    await client.query(
      `CREATE TABLE "grade_ncss" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=17`
    );

    await client.query(
      `CREATE TABLE "grade_mixed" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=30`
    );

    await client.query(
      `CREATE TABLE "grade_ice_water" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=21`
    );

    await client.query(
      `CREATE TABLE "grade_ice_alpine" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=18`
    );

    await client.query(
      `CREATE TABLE "grade_glacier" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    await client.query(
      `CREATE TABLE "grade_french" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=30`
    );

    await client.query(
      `CREATE TABLE "grade_river_crossing_rating" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    await client.query(
      `CREATE TABLE "grade_descent_rating" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    await client.query(
      `CREATE TABLE "grade_cascade_volcano" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "label" varchar(45) DEFAULT NULL,
        "typical_gear" varchar(500) DEFAULT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=7`
    );

    await client.query(
      `CREATE TABLE "grade_bushwhack_rating" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "adjectival" varchar(45) DEFAULT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=10`
    );

    await client.query(
      `CREATE TABLE "grade_bushwhack_grade" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=7`
    );

    await client.query(
      `CREATE TABLE "grade_bushwhack_aid" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    await client.query(
      `CREATE TABLE "grade_approach_rating" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    await client.query(
      `CREATE TABLE "grade_bouldering_hueco" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=22`
    );

    await client.query(
      `CREATE TABLE "grade_snow" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "steepness" varchar(45) NOT NULL COMMENT 'deegrees',
        "adjectival" varchar(45) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=15`
    );

    await client.query(
      `CREATE TABLE "grade_uiaa" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=30`
    );

    await client.query(
      `CREATE TABLE "grade_yds" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=68`
    );

    await client.query(
      `CREATE TABLE "grade_alaskan" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        "typical_gear" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=14`
    );

    await client.query(
      `CREATE TABLE "grade_aid_new_wave" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "fall_potential" varchar(100) DEFAULT NULL,
        "sequential_bodyweight_pieces" varchar(45) DEFAULT NULL,
        "typical_gear" varchar(100) DEFAULT NULL,
        "typical_time_per_pitch" varchar(45) DEFAULT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=43`
    );

    await client.query(
      `CREATE TABLE "grade_alpine" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "grade" varchar(45) NOT NULL,
        "name_french" varchar(45) DEFAULT NULL,
        "name_english" varchar(45) DEFAULT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=19`
    );

    // climbing type
    await client.query(
      `CREATE TABLE "climbing_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=10`
    );

    // === routes ===
    await client.query(
      `CREATE TABLE "climbing_travel_style" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "travel_style" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=8
      COMMENT='Overall style associated with a climbing route or trip.'`
    );

    await client.query(
      `CREATE TABLE "climbing_route_characteristic_rock" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=14 `
    );

    await client.query(
      `CREATE TABLE "climbing_route_characteristic_snow_ice" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=11`
    );

    // === trips ===

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