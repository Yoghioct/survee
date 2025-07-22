-- AlterTable
ALTER TABLE `survey` ADD COLUMN `disclaimerBody` TEXT NULL,
    ADD COLUMN `disclaimerTitle` TEXT NULL,
    ADD COLUMN `showDisclaimer` BOOLEAN NOT NULL DEFAULT false;
