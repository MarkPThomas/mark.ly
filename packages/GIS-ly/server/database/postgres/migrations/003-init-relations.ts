export class InitRelations003 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "map_resources_has_ge_file" (
        "ge_file_id" int(11) NOT NULL,
        "map_resources_id" int(11) NOT NULL,
        PRIMARY KEY ("ge_file_id","map_resources_id"),
        KEY "fk_map_resources_to_ge_files_map_resources1_idx" ("map_resources_id"),
        CONSTRAINT "fk_map_resources_to_ge_files_ge_files1"
          FOREIGN KEY ("ge_file_id")
          REFERENCES "file_google_earth" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_map_resources_to_ge_files_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "map_resources_has_gpx_file" (
        "gpx_file_id" int(11) NOT NULL,
        "map_resources_id" int(11) NOT NULL,
        PRIMARY KEY ("gpx_file_id","map_resources_id"),
        KEY "fk_map_resources_to_gpx_files_map_resources1_idx" ("map_resources_id"),
        CONSTRAINT "fk_map_resources_to_gpx_files_gpx_files1"
          FOREIGN KEY ("gpx_file_id")
          REFERENCES "file_gpx" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_map_resources_to_gpx_files_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "map_resources_has_topo_file" (
        "topo_file_id" int(11) NOT NULL,
        "map_resources_id" int(11) NOT NULL,
        PRIMARY KEY ("topo_file_id","map_resources_id"),
        KEY "fk_map_resources_to_topo_files_map_resources1_idx" ("map_resources_id"),
        CONSTRAINT "fk_map_resources_to_topo_files_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_map_resources_to_topo_files_topo_files1"
          FOREIGN KEY ("topo_file_id")
          REFERENCES "file_topo" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "map_resources_has_route_topo" (
        "route_topo_id" int(11) NOT NULL,
        "map_resources_id" int(11) NOT NULL,
        PRIMARY KEY ("route_topo_id","map_resources_id"),
        KEY "fk_map_resources_to_route_topos_map_resources1_idx" ("map_resources_id"),
        CONSTRAINT "fk_map_resources_to_route_topos_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_map_resources_to_route_topos_route_topos1"
          FOREIGN KEY ("route_topo_id")
          REFERENCES "climbing_route_topo" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "map_resources_has_map" (
        "map_id" int(11) NOT NULL,
        "map_resources_id" int(11) NOT NULL,
        PRIMARY KEY ("map_id","map_resources_id"),
        KEY "fk_map_resources_to_maps_map_resources1_idx" ("map_resources_id"),
        CONSTRAINT "fk_map_resources_to_maps_map_resources1"
          FOREIGN KEY ("map_resources_id")
          REFERENCES "map_resource" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_map_resources_to_maps_maps1"
          FOREIGN KEY ("map_id")
          REFERENCES "maps" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`
    );

    await client.query(
      `CREATE TABLE "map_resource_has_photo_annotated" (
        "photo_annotated_id" int(11) NOT NULL,
        "map_resource_id" int(11) NOT NULL,
        PRIMARY KEY ("photo_annotated_id","map_resource_id"),
        KEY "fk_map_resources_to_annotated_images_map_resources1_idx" ("map_resource_id"),
        CONSTRAINT "fk_map_resources_to_annotated_images_annotated_images1"
          FOREIGN KEY ("photo_annotated_id")
          REFERENCES "photo_annotated" ("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "fk_map_resources_to_annotated_images_map_resources1"
          FOREIGN KEY ("map_resource_id")
          REFERENCES "map_resource" ("id")
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