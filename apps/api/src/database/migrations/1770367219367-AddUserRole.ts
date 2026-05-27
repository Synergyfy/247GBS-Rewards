import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1770367219367 implements MigrationInterface {
    name = 'AddUserRole1770367219367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Users_role_enum" AS ENUM('super_admin', 'admin', 'staff', 'customer')`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "role" "public"."Users_role_enum" NOT NULL DEFAULT 'customer'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."Users_role_enum"`);
    }

}
