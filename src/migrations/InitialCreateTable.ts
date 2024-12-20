import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734921783311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "peanuts"
             (
                 "id"          SERIAL PRIMARY KEY,
                 "name"        VARCHAR(255) NOT NULL DEFAULT 'Unknown',
                 "description" VARCHAR(255) NOT NULL DEFAULT 'description'
             )
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "peanuts"
        `);
    }

}
