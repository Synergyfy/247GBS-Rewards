import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropVoucherManagement1793500000000 implements MigrationInterface {
  name = 'DropVoucherManagement1793500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "voucher" CASCADE`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."voucher_type_enum" CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."voucher_type_enum" AS ENUM('LINK', 'CREDENTIALS', 'MCOM_LOYALTY_TIER', 'MCOM_MALL_TIER', 'MALL_OFFER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "type" "public"."voucher_type_enum" NOT NULL, "config" jsonb, "isRedeemed" boolean NOT NULL DEFAULT false, "redeemedAt" TIMESTAMP, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_73e3d2a7719851716e940836980" UNIQUE ("code"), CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`,
    );
  }
}
