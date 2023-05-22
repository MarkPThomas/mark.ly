export class InitTables002 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "climbing_rack_hex" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "company" varchar(45) DEFAULT NULL,
        "brand" varchar(45) DEFAULT NULL,
        "color" varchar(45) DEFAULT NULL,
        "size_label" varchar(10) NOT NULL,
        "weight" int(11) DEFAULT NULL COMMENT 'grams',
        "size_min" float DEFAULT NULL COMMENT 'mm',
        "size_max" float DEFAULT NULL COMMENT 'mm',
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=23`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_nut" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "company" varchar(45) DEFAULT NULL,
        "brand" varchar(45) DEFAULT NULL,
        "nuts_type_id" int(11) DEFAULT NULL,
        "nuts_color" varchar(45) DEFAULT NULL,
        "size_label" varchar(10) NOT NULL,
        "weight" int(11) DEFAULT NULL COMMENT 'grams',
        "size_min" float DEFAULT NULL COMMENT 'mm',
        "size_max" float DEFAULT NULL COMMENT 'mm',
        PRIMARY KEY ("id"),
        KEY "fk_climbing_rack_nuts_nuts_type_idx" ("nuts_type_id"),
        CONSTRAINT "fk_climbing_rack_nuts_nuts_type"
          FOREIGN KEY ("nuts_type_id")
          REFERENCES "climbing_rack_nut_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=101`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_slcd" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "company" varchar(45) DEFAULT NULL,
        "brand" varchar(45) DEFAULT NULL,
        "color" varchar(45) DEFAULT NULL,
        "size_label" varchar(10) NOT NULL,
        "weight" int(11) DEFAULT NULL COMMENT 'grams',
        "size_min" float DEFAULT NULL COMMENT 'mm',
        "size_max" float DEFAULT NULL COMMENT 'mm',
        "axle_type_id" int(11) DEFAULT NULL,
        "stem_type_id" int(11) DEFAULT NULL,
        "lobe_symmetry_id" int(11) DEFAULT NULL,
        "lobe_type_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_climbing_rack_SLCDs_axle_type1_idx" ("axle_type_id"),
        KEY "fk_climbing_rack_SLCDs_stem_type1_idx" ("stem_type_id"),
        KEY "fk_climbing_rack_SLCDs_lobe_symmetry1_idx" ("lobe_symmetry_id"),
        KEY "fk_climbing_rack_SLCDs_lobe_type1_idx" ("lobe_type_id"),
        CONSTRAINT "fk_climbing_rack_SLCDs_axle_type1"
          FOREIGN KEY ("axle_type_id")
          REFERENCES "climbing_rack_cam_axle_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_SLCDs_lobe_symmetry1"
          FOREIGN KEY ("lobe_symmetry_id")
          REFERENCES "climbing_rack_cam_lobe_symmetry" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_SLCDs_lobe_type1"
          FOREIGN KEY ("lobe_type_id")
          REFERENCES "climbing_rack_cam_lobe_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_SLCDs_stem_type1"
          FOREIGN KEY ("stem_type_id")
          REFERENCES "climbing_rack_cam_stem_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=148 `
    );

    await client.query(
      `CREATE TABLE "climbing_rack_sling" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "company" varchar(45) DEFAULT NULL,
        "brand" varchar(45) DEFAULT NULL,
        "size_width" int(11) DEFAULT NULL COMMENT 'mm\n',
        "length" int(11) DEFAULT NULL COMMENT 'mm',
        "weight" int(11) DEFAULT NULL COMMENT 'grams',
        "sling_size_category_id" int(11) DEFAULT NULL,
        "sling_type_id" int(11) DEFAULT NULL,
        "sling_width_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_climbing_rack_slings_sling_size_category1_idx" ("sling_size_category_id"),
        KEY "fk_climbing_rack_slings_sling_type1_idx" ("sling_type_id"),
        KEY "fk_climbing_rack_slings_sling_width1_idx" ("sling_width_id"),
        CONSTRAINT "fk_climbing_rack_slings_sling_size_category1"
          FOREIGN KEY ("sling_size_category_id")
          REFERENCES "climbing_rack_sling_size_category" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_slings_sling_type1"
          FOREIGN KEY ("sling_type_id")
          REFERENCES "climbing_rack_sling_type" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_slings_sling_width1"
          FOREIGN KEY ("sling_width_id")
          REFERENCES "climbing_rack_sling_width" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=18`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_big_bro" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "company" varchar(45) DEFAULT NULL,
        "color" varchar(45) DEFAULT NULL,
        "size_label" varchar(10) NOT NULL,
        "weight" int(11) DEFAULT NULL COMMENT 'grams',
        "size_min" float DEFAULT NULL COMMENT 'mm',
        "size_max" float DEFAULT NULL COMMENT 'mm',
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=5`
    );

    await client.query(
      `CREATE TABLE "climbing_rack" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "weight" int(11) DEFAULT NULL COMMENT 'grams',
        PRIMARY KEY ("id")
      ) `
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