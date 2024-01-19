export class InitEnums001 {
  public async up(client): Promise<void> {
    // Camps & Trailheads
    await client.query(
      `CREATE TABLE "camp_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=10`
    );

    await client.query(
      `CREATE TABLE "objective_hazard" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=10`
    );

    await client.query(
      `CREATE TABLE "trailhead_classification" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=5`
    );

    await client.query(
      `CREATE TABLE "trailhead_developed" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=4`
    );

    // === trips ===
    await client.query(
      `CREATE TABLE "trip_season" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "season" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=4`
    );

    await client.query(
      `CREATE TABLE "trip_route_method" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "route_method" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    await client.query(
      `CREATE TABLE "trip_route_condition" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "condition" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=5`
    );

    await client.query(
      `CREATE TABLE "trip_tags" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "tag" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=7
      COMMENT='Earlier TR groupings. Might be better to associate tags?';
      `
    );

    await client.query(
      `CREATE TABLE "trip_characteristic" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}