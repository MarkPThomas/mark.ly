import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1600418354075 implements MigrationInterface {
  name = 'Init1600418354075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."access_token" ("token" text NOT NULL, "client" text NOT NULL, "issued_by" text NOT NULL, "created_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_bd398c27a44d12030ef518f2878" PRIMARY KEY ("token"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "access_token_pkey" ON "public"."access_token" ("token") `);

    await queryRunner.query(
      `CREATE TABLE "public"."account" ("handle" text NOT NULL, "first_name" text NOT NULL, "last_name" text NOT NULL, "username" text, "email" text, "account_closed" boolean, "account_removed" boolean, "personas" jsonb, "time_to_live" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_fb9e7dacf5c25257f998f5215ad" PRIMARY KEY ("handle"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "account_pkey" ON "public"."account" ("handle") `);

    await queryRunner.query(
      `CREATE TABLE "public"."user_claims" ("handle" text NOT NULL, "claims" jsonb NOT NULL, "time_to_live" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_ca347b34a74012894b8c2d612db" PRIMARY KEY ("handle"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "user_claims_pkey" ON "public"."user_claims" ("handle") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_claims_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."user_claims"`);

    await queryRunner.query(`DROP INDEX "public"."account_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."account"`);

    await queryRunner.query(`DROP INDEX "public"."access_token_pkey"`);
    await queryRunner.query(`DROP TABLE "public"."access_token"`);
  }
}