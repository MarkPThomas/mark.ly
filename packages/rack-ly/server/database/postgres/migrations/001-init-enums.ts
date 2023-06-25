export class InitEnums001 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "climbing_rack_cam_axle_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=4`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_cam_lobe_symmetry" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=5`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_cam_lobe_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=4`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_cam_stem_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=4`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_nut_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(45) DEFAULaxleT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=8`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_sling_size_category" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_sling_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=7`
    );


    await client.query(
      `CREATE TABLE "climbing_rack_sling_width" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(45) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=5`
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