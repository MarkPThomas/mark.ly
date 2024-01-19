export class InitEnums001 {
  public async up(client): Promise<void> {
    // GIS Points, lines & shapes
    await client.query(
      `CREATE TABLE "gis_marker_route_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=15`
    );

    await client.query(
      `CREATE TABLE "gis_marker_interest_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=12`
    );

    await client.query(
      `CREATE TABLE "gis_network_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=3`
    );

    await client.query(
      `CREATE TABLE "gis_feature_large_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=9`
    );

    await client.query(
      `CREATE TABLE "gis_region_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=8`
    );

    // GIS Paths (Routes, approaches, etc.)
    await client.query(
      `CREATE TABLE "path_segment_classification" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=24`
    );

    // GPS Tracks & Placemarks
    await client.query(
      `CREATE TABLE "travel_mode" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=17`
    );

    // Political Areas
    await client.query(
      `CREATE TABLE "land_ownership"(
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY("id")
      ) AUTO_INCREMENT = 24`
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