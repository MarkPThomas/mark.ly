export class InitRelations003 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "climbing_rack_has_big_bro" (
        "climbing_rack_id" int(11) NOT NULL,
        "big_bro_id" int(11) NOT NULL,
        "quantity" int(11) NOT NULL DEFAULT '0',
        "notes" text,
        "quantity_optional" int(11) NOT NULL DEFAULT '0',
        "notes_quantity_optional" text,
        PRIMARY KEY ("climbing_rack_id","big_bro_id"),
        KEY "fk_climbing_rack_to_big_bro_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_climbing_rack_to_big_bro_climbing_rack_big_bro1_idx" ("big_bro_id"),
        CONSTRAINT "fk_climbing_rack_to_big_bro_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_to_big_bro_climbing_rack_big_bro1"
          FOREIGN KEY ("big_bro_id")
          REFERENCES "climbing_rack_big_bro" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_has_hex" (
        "climbing_rack_id" int(11) NOT NULL,
        "hexes_id" int(11) NOT NULL,
        "quantity" int(11) NOT NULL DEFAULT '0',
        "notes" text,
        "quantity_optional" int(11) NOT NULL DEFAULT '0',
        "notes_quantity_optional" text,
        PRIMARY KEY ("climbing_rack_id","hexes_id"),
        KEY "fk_climbing_rack_to_hexes_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_climbing_rack_to_hexes_climbing_rack_hex1_idx" ("hexes_id"),
        CONSTRAINT "fk_climbing_rack_to_hexes_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_to_hexes_climbing_rack_hexes1"
          FOREIGN KEY ("hexes_id")
          REFERENCES "climbing_rack_hex" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_has_nut" (
        "climbing_rack_id" int(11) NOT NULL,
        "nuts_id" int(11) NOT NULL,
        "quantity" int(11) NOT NULL DEFAULT '0',
        "notes" text,
        "quantity_optional" int(11) NOT NULL DEFAULT '0',
        "notes_quantity_optional" text,
        PRIMARY KEY ("climbing_rack_id","nuts_id"),
        KEY "fk_climbing_rack_to_nuts_climbing_rack_nuts_idx" ("nuts_id"),
        KEY "fk_climbing_rack_to_nuts_climbing_rack1_idx" ("climbing_rack_id"),
        CONSTRAINT "fk_climbing_rack_to_nuts_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_to_nuts_climbing_rack_nuts"
          FOREIGN KEY ("nuts_id")
          REFERENCES "climbing_rack_nut" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_has_slcd" (
        "climbing_rack_id" int(11) NOT NULL,
        "SLCD_id" int(11) NOT NULL,
        "quantity" int(11) NOT NULL DEFAULT '0',
        "notes" text,
        "quantity_optional" int(11) NOT NULL DEFAULT '0',
        "notes_quantity_optional" text,
        PRIMARY KEY ("climbing_rack_id","SLCD_id"),
        KEY "fk_climbing_rack_to_SLCDs_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_climbing_rack_to_SLCDs_climbing_rack_SLCD1_idx" ("SLCD_id"),
        CONSTRAINT "fk_climbing_rack_to_SLCDs_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_to_SLCDs_climbing_rack_SLCDs1"
          FOREIGN KEY ("SLCD_id")
          REFERENCES "climbing_rack_slcd" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_has_sling" (
        "climbing_rack_id" int(11) NOT NULL,
        "sling_id" int(11) NOT NULL,
        "quantity" int(11) NOT NULL DEFAULT '0',
        "notes" text,
        "quantity_optional" int(11) NOT NULL DEFAULT '0',
        "notes_quantity_optional" text,
        PRIMARY KEY ("climbing_rack_id","sling_id"),
        KEY "fk_climbing_rack_to_slings_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_climbing_rack_to_slings_climbing_rack_sling1_idx" ("sling_id"),
        CONSTRAINT "fk_climbing_rack_to_slings_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_to_slings_climbing_rack_slings1"
          FOREIGN KEY ("sling_id")
          REFERENCES "climbing_rack_sling" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "climbing_rack_has_tricam" (
        "climbing_rack_id" int(11) NOT NULL,
        "tricams_id" int(11) NOT NULL,
        "tricams_quantity" int(11) NOT NULL DEFAULT '0',
        "notes" text,
        "tricams_quantity_optional" int(11) NOT NULL DEFAULT '0',
        "notes_quantity_optional" text,
        PRIMARY KEY ("climbing_rack_id","tricams_id"),
        KEY "fk_climbing_rack_to_tricams_climbing_rack1_idx" ("climbing_rack_id"),
        KEY "fk_climbing_rack_to_tricams_climbing_rack_tricam1_idx" ("tricams_id"),
        CONSTRAINT "fk_climbing_rack_to_tricams_climbing_rack1"
          FOREIGN KEY ("climbing_rack_id")
          REFERENCES "climbing_rack" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_climbing_rack_to_tricams_climbing_rack_tricams1"
          FOREIGN KEY ("tricams_id")
          REFERENCES "climbing_rack_tricam" ("id")
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
  }

  public async down(client): Promise<void> {
    await client.query(
      ``
    );
  }
}