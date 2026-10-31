import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerNameUpdate1770200208737 implements MigrationInterface {
    name = 'CustomerNameUpdate1770200208737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add new columns as nullable initially
        await queryRunner.query(`ALTER TABLE "Customers" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "Customers" ADD "lastName" character varying`);

        // 2. Data Migration: Split fullName into firstName and lastName
        // Logic: firstName is everything before the first space, lastName is everything after. 
        // If no space, lastName defaults to empty string or repeat firstName (using empty string here).
        
        // This SQL handles the split. 
        // SPLIT_PART(string, delimiter, position)
        // Check if there is a space, if not, entire name is firstName.
        await queryRunner.query(`
            UPDATE "Customers"
            SET 
                "firstName" = SPLIT_PART("fullName", ' ', 1),
                "lastName" = SUBSTRING("fullName" FROM POSITION(' ' IN "fullName") + 1)
        `);
        
        // Handle cases where there was no space (lastName would be null or empty)
        await queryRunner.query(`UPDATE "Customers" SET "lastName" = '' WHERE "lastName" IS NULL OR "lastName" = ''`);

        // 3. Make columns NOT NULL now that they have data
        await queryRunner.query(`ALTER TABLE "Customers" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Customers" ALTER COLUMN "lastName" SET NOT NULL`);

        // 4. Drop old column
        await queryRunner.query(`ALTER TABLE "Customers" DROP COLUMN "fullName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Add fullName back
        await queryRunner.query(`ALTER TABLE "Customers" ADD "fullName" character varying`);

        // 2. Concatenate first and last name
        await queryRunner.query(`
            UPDATE "Customers" 
            SET "fullName" = TRIM("firstName" || ' ' || "lastName")
        `);

        // 3. Set NOT NULL
        await queryRunner.query(`ALTER TABLE "Customers" ALTER COLUMN "fullName" SET NOT NULL`);

        // 4. Drop new columns
        await queryRunner.query(`ALTER TABLE "Customers" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "Customers" DROP COLUMN "firstName"`);
    }
}