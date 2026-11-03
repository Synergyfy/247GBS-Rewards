import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Accounts in "Users" are business owners (customers and staff have their own
 * tables), but direct signups used to fall back to the 'customer' role. Make
 * 'admin' the default and fix existing rows so super-admin "admins" lists are
 * complete.
 */
export class DefaultUserRoleAdmin1793600000000 implements MigrationInterface {
  name = 'DefaultUserRoleAdmin1793600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'admin'`,
    );
    await queryRunner.query(
      `UPDATE "Users" SET "role" = 'admin' WHERE "role" = 'customer'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restores the old default only; promoted rows cannot be told apart and stay 'admin'.
    await queryRunner.query(
      `ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'customer'`,
    );
  }
}
