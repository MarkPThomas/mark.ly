export class InitTables002 {
  public async up(client): Promise<void> {
    await client.query(
      `CREATE TABLE "scraper_markpthomas_page" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" int(11) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "page_menu_name" varchar(100) DEFAULT NULL,
        "title" varchar(200) DEFAULT NULL,
        "type" varchar(45) DEFAULT NULL,
        "content" text,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=91`
    );

    await client.query(
      `CREATE TABLE "scraper_mountainproject_area" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" int(11) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "name" varchar(100) DEFAULT NULL,
        "description" text,
        "getting_there" text,
        "latitude" float DEFAULT NULL,
        "longitude" float DEFAULT NULL,
        "parent_name" varchar(100) DEFAULT NULL,
        "parent_url" varchar(200) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=447`
    );

    await client.query(
      `CREATE TABLE "scraper_mountainproject_route" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" int(11) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "name" varchar(100) DEFAULT NULL,
        "description" text,
        "route_quality" float DEFAULT NULL,
        "rating" varchar(45) DEFAULT NULL,
        "rating_original" varchar(45) DEFAULT NULL,
        "route_type" varchar(45) DEFAULT NULL,
        "parent_name" varchar(100) DEFAULT NULL,
        "parent_url" varchar(200) DEFAULT NULL,
        "parent_page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_scraper_mountainproject_route_scraper_mountainproject_ar_idx" ("parent_page_id"),
        CONSTRAINT "fk_scraper_mountainproject_route_scraper_mountainproject_area1"
          FOREIGN KEY ("parent_page_id")
          REFERENCES "scraper_mountainproject_area" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=605`
    );

    await client.query(
      `CREATE TABLE "scraper_mountainproject_route_overwrite" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "url" varchar(200) NOT NULL,
        "my_rating" varchar(45) DEFAULT NULL,
        "my_stars" varchar(45) DEFAULT NULL,
        "parent_page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_scraper_mountainproject_route_overwrite_scraper_mountain_idx" ("parent_page_id"),
        CONSTRAINT "fk_scraper_mountainproject_route_overwrite_scraper_mountainpr1"
          FOREIGN KEY ("parent_page_id")
          REFERENCES "scraper_mountainproject_route" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=412`
    );

    await client.query(
      `CREATE TABLE "scraper_mountainproject_tick_list" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "url" varchar(200) NOT NULL,
        "name" varchar(100) DEFAULT NULL,
        "tick_date" varchar(45) DEFAULT NULL,
        "comments" text,
        "parent_page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_scraper_mountainproject_tick_list_scraper_mountainprojec_idx" ("parent_page_id"),
        CONSTRAINT "fk_scraper_mountainproject_tick_list_scraper_mountainproject_1"
          FOREIGN KEY ("parent_page_id")
          REFERENCES "scraper_mountainproject_route" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=412`
    );

    await client.query(
      `CREATE TABLE "scraper_mountainproject_todo_list" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "name" varchar(100) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "parent_page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_scraper_mountainproject_todo_list_scraper_mountainprojec_idx" ("parent_page_id"),
        CONSTRAINT "fk_scraper_mountainproject_todo_list_scraper_mountainproject_1"
          FOREIGN KEY ("parent_page_id")
          REFERENCES "scraper_mountainproject_route" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=203`
    );

    await client.query(
      `CREATE TABLE "scraper_peakbagger_peak" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" varchar(45) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "name" varchar(100) DEFAULT NULL,
        "name_other" varchar(100) DEFAULT NULL,
        "elevation" int(11) DEFAULT NULL COMMENT 'feet',
        "latitude" float DEFAULT NULL,
        "longitude" float DEFAULT NULL,
        "peak_type" varchar(100) DEFAULT NULL,
        "land" varchar(100) DEFAULT NULL,
        "wilderness_special_area" varchar(100) DEFAULT NULL,
        "state_province1" varchar(100) DEFAULT NULL,
        "state_province2" varchar(100) DEFAULT NULL,
        "range_1" varchar(100) DEFAULT NULL,
        "range_2" varchar(100) DEFAULT NULL,
        "range_3" varchar(100) DEFAULT NULL,
        "range_4" varchar(100) DEFAULT NULL,
        "description" text,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=68566`
    );

    await client.query(
      `CREATE TABLE "scraper_peakbagger_range" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" varchar(45) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "name" varchar(100) DEFAULT NULL,
        "level" int(11) DEFAULT NULL,
        "type" varchar(100) DEFAULT NULL,
        "latitude_center" float DEFAULT NULL,
        "longitude_center" float DEFAULT NULL,
        "extent_NS" int(11) DEFAULT NULL COMMENT 'miles',
        "extent_EW" int(11) DEFAULT NULL COMMENT 'miles',
        "description" text,
        "parent" varchar(100) DEFAULT NULL,
        "is_page_scraped" varchar(3) DEFAULT NULL,
        "parent_page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_scraper_peakbagger_range_scraper_peakbagger_peak1_idx" ("parent_page_id"),
        CONSTRAINT "fk_scraper_peakbagger_range_scraper_peakbagger_peak1"
          FOREIGN KEY ("parent_page_id")
          REFERENCES "scraper_peakbagger_peak" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=2972`
    );

    await client.query(
      `CREATE TABLE "scraper_summitpost_climber_log" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" varchar(100) DEFAULT NULL,
        "route_name" varchar(100) DEFAULT NULL,
        "object_url" varchar(200) NOT NULL,
        "log_url" varchar(200) NOT NULL,
        "date" varchar(45) DEFAULT NULL,
        "title" varchar(45) DEFAULT NULL,
        "success" varchar(45) DEFAULT NULL,
        "message" text,
        "parent_page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_scraper_summitpost_climber_log_scraper_summitpost_object_idx" ("parent_page_id"),
        CONSTRAINT "fk_scraper_summitpost_climber_log_scraper_summitpost_object1"
          FOREIGN KEY ("parent_page_id")
          REFERENCES "scraper_summitpost_object" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=234`
    );

    await client.query(
      `CREATE TABLE "scraper_summitpost_object" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" int(11) DEFAULT NULL,
        "page_url" varchar(200) NOT NULL,
        "parent_url" varchar(200) DEFAULT NULL,
        "name" varchar(45) DEFAULT NULL,
        "activities" varchar(100) DEFAULT NULL,
        "date" varchar(45) DEFAULT NULL,
        "difficulty" varchar(45) DEFAULT NULL,
        "elevation" varchar(45) DEFAULT NULL,
        "grade" varchar(45) DEFAULT NULL,
        "hits" int(11) DEFAULT NULL,
        "latitude" float DEFAULT NULL,
        "longitude" float DEFAULT NULL,
        "location" varchar(100) DEFAULT NULL,
        "my_route_quality" varchar(45) DEFAULT NULL,
        "number_of_pitches" varchar(45) DEFAULT NULL,
        "parent_code" int(11) DEFAULT NULL,
        "parent_name" varchar(100) DEFAULT NULL,
        "rock_difficulty" varchar(45) DEFAULT NULL,
        "route_quality" varchar(45) DEFAULT NULL,
        "route_type" varchar(45) DEFAULT NULL,
        "seasons" varchar(45) DEFAULT NULL,
        "time_required" varchar(45) DEFAULT NULL,
        "type" varchar(45) DEFAULT NULL,
        "content" text,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=303`
    );

    await client.query(
      `CREATE TABLE "scraper_supertopo_report" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" varchar(45) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "name" varchar(200) DEFAULT NULL,
        "content" text,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=66`
    );

    await client.query(
      `CREATE TABLE "scraper_supertopo_report_summary" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "page_id" varchar(45) DEFAULT NULL,
        "url" varchar(200) NOT NULL,
        "name" varchar(200) DEFAULT NULL,
        "hits" int(11) DEFAULT NULL,
        "messages" int(11) DEFAULT NULL,
        "parent_page_id" int(11) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "fk_scraper_supertopo_report_summary_scraper_supertopo_repor_idx" ("parent_page_id"),
        CONSTRAINT "fk_scraper_supertopo_report_summary_scraper_supertopo_report1"
          FOREIGN KEY ("parent_page_id")
          REFERENCES "scraper_supertopo_report" ("id")
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) AUTO_INCREMENT=66`
    );

    await client.query(
      `CREATE TABLE "scraper_supertopo_route" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "url" varchar(200) NOT NULL,
        "title" varchar(100) DEFAULT NULL,
        "climbing_area" varchar(100) DEFAULT NULL,
        "formation" varchar(100) DEFAULT NULL,
        "quality" varchar(100) DEFAULT NULL,
        "rating" varchar(100) DEFAULT NULL,
        "pitch_number" varchar(45) DEFAULT NULL,
        "img_url" varchar(200) DEFAULT NULL,
        PRIMARY KEY ("id")
      ) AUTO_INCREMENT=6`
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