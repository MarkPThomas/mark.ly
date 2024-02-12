export class InitEnums001 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "report_trip_type" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(100) NOT NULL,
        "description" varchar(500) DEFAULT NULL,
        PRIMARY KEY("id")
      ) AUTO_INCREMENT=5`
    );

    await client.query(
      `CREATE TABLE "header_type" (
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