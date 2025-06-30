-- AlterTable
CREATE SEQUENCE exercise_id_seq;
ALTER TABLE "Exercise" ALTER COLUMN "id" SET DEFAULT nextval('exercise_id_seq');
ALTER SEQUENCE exercise_id_seq OWNED BY "Exercise"."id";
