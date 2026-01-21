import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(),
        "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(),
        "fecha_eliminacion" TIMESTAMP,
        "estado" boolean NOT NULL DEFAULT true,
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "nombre" character varying,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_uuid" UNIQUE ("uuid"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" SERIAL NOT NULL,
        "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(),
        "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(),
        "fecha_eliminacion" TIMESTAMP,
        "estado" boolean NOT NULL DEFAULT true,
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "titulo" character varying(200) NOT NULL,
        "descripcion" text NOT NULL,
        "completada" boolean NOT NULL DEFAULT false,
        "fecha_entrega" TIMESTAMP NOT NULL,
        "comentarios" text,
        "responsable" character varying,
        "tags" jsonb NOT NULL DEFAULT '[]',
        "user_id" integer NOT NULL,
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tasks_uuid" UNIQUE ("uuid"),
        CONSTRAINT "FK_tasks_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "tasks"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}