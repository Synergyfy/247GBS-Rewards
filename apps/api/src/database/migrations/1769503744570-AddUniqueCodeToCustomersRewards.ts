import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueCodeToCustomersRewards1769503744570 implements MigrationInterface {
    name = 'AddUniqueCodeToCustomersRewards1769503744570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."voucher_type_enum" RENAME TO "voucher_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."voucher_type_enum" AS ENUM('LINK', 'CREDENTIALS', 'MCOM_LOYALTY_TIER', 'MCOM_MALL_TIER', 'MALL_OFFER')`);
        await queryRunner.query(`ALTER TABLE "voucher" ALTER COLUMN "type" TYPE "public"."voucher_type_enum" USING "type"::"text"::"public"."voucher_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."voucher_type_enum_old" AS ENUM('LINK', 'CREDENTIALS', 'MCOM_LOYALTY_TIER', 'MCOM_MALL_TIER', 'MCOM_BUNDLE', 'MALL_OFFER')`);
        await queryRunner.query(`ALTER TABLE "voucher" ALTER COLUMN "type" TYPE "public"."voucher_type_enum_old" USING "type"::"text"::"public"."voucher_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."voucher_type_enum_old" RENAME TO "voucher_type_enum"`);
    }

}
