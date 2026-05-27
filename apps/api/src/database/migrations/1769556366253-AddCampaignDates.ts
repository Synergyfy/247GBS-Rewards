import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCampaignDates1769556366253 implements MigrationInterface {
    name = 'AddCampaignDates1769556366253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Campaign" ADD "startDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Campaign" ADD "endDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Campaign" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "Campaign" DROP COLUMN "startDate"`);
    }

}
