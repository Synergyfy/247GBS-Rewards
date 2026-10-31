import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueCodeColumn1769503890437 implements MigrationInterface {
    name = 'AddUniqueCodeColumn1769503890437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CustomersRewards" ADD "uniqueCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CustomersRewards" DROP COLUMN "uniqueCode"`);
    }

}
