import { MigrationInterface, QueryRunner } from "typeorm";

export class RewardPageUpdate1770195030937 implements MigrationInterface {
    name = 'RewardPageUpdate1770195030937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Rewards" ADD "successPageTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "Rewards" ADD "successPageMessage" character varying`);
        await queryRunner.query(`ALTER TABLE "Rewards" ADD "successPageButtonLink" character varying`);
        await queryRunner.query(`ALTER TABLE "Campaign" ALTER COLUMN "signupPoints" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Campaign" ALTER COLUMN "signupPoints" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Rewards" DROP COLUMN "successPageButtonLink"`);
        await queryRunner.query(`ALTER TABLE "Rewards" DROP COLUMN "successPageMessage"`);
        await queryRunner.query(`ALTER TABLE "Rewards" DROP COLUMN "successPageTitle"`);
    }

}
