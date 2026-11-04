import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Backend requirements for the super-admin dashboard:
 * - account activation flag on Users
 * - super-admin campaign enable/disable flag on Campaign
 * - append-only super-admin audit trail
 */
export class SuperAdminDashboard1793700000000 implements MigrationInterface {
  name = 'SuperAdminDashboard1793700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."SuperAdmin Audit Logs_targetType_enum" AS ENUM('user', 'business', 'campaign', 'staff', 'customer', 'code')`,
    );
    await queryRunner.query(
      `CREATE TABLE "SuperAdmin Audit Logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "action" character varying NOT NULL,
        "targetType" "public"."SuperAdmin Audit Logs_targetType_enum" NOT NULL,
        "targetId" character varying NOT NULL,
        "payload" jsonb,
        "ip" character varying,
        "actorId" uuid,
        CONSTRAINT "PK_super_admin_audit_logs" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "SuperAdmin Audit Logs"
       ADD CONSTRAINT "FK_super_admin_audit_logs_actor"
       FOREIGN KEY ("actorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_super_admin_audit_logs_actor" ON "SuperAdmin Audit Logs" ("actorId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_super_admin_audit_logs_target_type" ON "SuperAdmin Audit Logs" ("targetType")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_super_admin_audit_logs_target_id" ON "SuperAdmin Audit Logs" ("targetId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_super_admin_audit_logs_created_at" ON "SuperAdmin Audit Logs" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "SuperAdmin Audit Logs" CASCADE`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."SuperAdmin Audit Logs_targetType_enum" CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Campaign" DROP COLUMN IF EXISTS "isActive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN IF EXISTS "isActive"`,
    );
  }
}
