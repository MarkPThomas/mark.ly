export class InitTables002 {
  // public async up(client): Promise<void> {
  //   await client.query(
  //     `CREATE TABLE "user_role" (
  //       "id" int(11) NOT NULL AUTO_INCREMENT,
  //       "name" varchar(255) NOT NULL,
  //       PRIMARY KEY ("id")
  //     ) AUTO_INCREMENT=4`
  //   );

  //   await client.query(
  //     `CREATE TABLE "user" (
  //       "id" int(11) NOT NULL AUTO_INCREMENT,
  //       "username" varchar(255) NOT NULL,
  //       "user_role_id" int(11) NOT NULL,
  //       "password" varchar(255) NOT NULL,
  //       "image" text,
  //       "first_name" varchar(255) DEFAULT NULL,
  //       "last_name" varchar(255) DEFAULT NULL,
  //       "email" varchar(255) NOT NULL,
  //       "phone" varchar(50) DEFAULT NULL,
  //       "personal_url" text,
  //       "linkedin_url" text,
  //       "facebook_url" text,
  //       "twitter_url" text,
  //       "summitpost_url" text,
  //       "summitpost_username" varchar(255) DEFAULT NULL,
  //       "summitpost_password" varchar(255) DEFAULT NULL,
  //       "supertopo_url" text,
  //       "supertopo_username" varchar(255) DEFAULT NULL,
  //       "supertopo_password" varchar(255) DEFAULT NULL,
  //       "mountainproject_url" text,
  //       "mountainproject_username" varchar(255) DEFAULT NULL,
  //       "mountainproject_password" varchar(255) DEFAULT NULL,
  //       "random_salt" varchar(255) NOT NULL DEFAULT '$2y$10$iusesomecrazystrings22',
  //       "token" text,
  //       PRIMARY KEY ("id"),
  //       KEY "fk_user_user_role1_idx" ("user_role_id"),
  //       CONSTRAINT "fk_user_user_role1"
  //         FOREIGN KEY ("user_role_id")
  //         REFERENCES "user_role" ("id")
  //         ON DELETE NO ACTION
  //         ON UPDATE NO ACTION
  //     ) AUTO_INCREMENT=2`
  //   );

  //   // photo
  //   await client.query(
  //     `CREATE TABLE "page" (
  //       "id" int(11) NOT NULL AUTO_INCREMENT,
  //       "title_menu" varchar(90) NOT NULL,
  //       "title_full" varchar(500) NOT NULL,
  //       "description" text NOT NULL,
  //       "photo_id" int(11) DEFAULT NULL,
  //       "url" text,
  //       "date_created" datetime DEFAULT NULL,
  //       "date_modified" datetime DEFAULT NULL,
  //       "status_id" int(11) NOT NULL DEFAULT '1',
  //       "page_tasks" text,
  //       "is_public" tinyint(1) NOT NULL DEFAULT '0',
  //       "views_count" int(11) NOT NULL DEFAULT '0',
  //       "user_id" int(11) NOT NULL DEFAULT '1',
  //       PRIMARY KEY ("id"),
  //       KEY "fk_pages_status1_idx" ("status_id"),
  //       KEY "fk_page_photo1_idx" ("photo_id"),
  //       KEY "fk_page_user1_idx" ("user_id"),
  //       CONSTRAINT "fk_page_photo1"
  //         FOREIGN KEY ("photo_id")
  //         REFERENCES "photo" ("id")
  //         ON DELETE SET NULL
  //         ON UPDATE CASCADE,
  //       CONSTRAINT "fk_page_user1"
  //         FOREIGN KEY ("user_id")
  //         REFERENCES "user" ("id")
  //         ON DELETE NO ACTION
  //         ON UPDATE NO ACTION,
  //       CONSTRAINT "fk_pages_status1"
  //         FOREIGN KEY ("status_id")
  //         REFERENCES "status" ("id")
  //         ON DELETE CASCADE
  //         ON UPDATE CASCADE
  //     ) AUTO_INCREMENT=1023`
  //   );

  //   // reference
  //   await client.query(
  //     `CREATE TABLE "page_has_reference" (
  //       "page_id" int(11) NOT NULL,
  //       "reference_id" int(11) NOT NULL,
  //       PRIMARY KEY ("page_id","reference_id"),
  //       KEY "fk_page_has_reference_reference1_idx" ("reference_id"),
  //       KEY "fk_page_has_reference_page1_idx" ("page_id"),
  //       CONSTRAINT "fk_page_has_reference_page1"
  //         FOREIGN KEY ("page_id")
  //         REFERENCES "page" ("id")
  //         ON DELETE CASCADE
  //         ON UPDATE CASCADE,
  //       CONSTRAINT "fk_page_has_reference_reference1"
  //         FOREIGN KEY ("reference_id")
  //         REFERENCES "reference" ("id")
  //         ON DELETE CASCADE
  //         ON UPDATE CASCADE
  //     )`
  //   );


  //   await client.query(
  //     ``
  //   );
  // }

  // public async down(client): Promise<void> {
  //   await client.query(
  //     ``
  //   );
  // }
}