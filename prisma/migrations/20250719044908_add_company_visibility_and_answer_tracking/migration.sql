-- AlterTable
ALTER TABLE `answer` ADD COLUMN `companyId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `survey` ADD COLUMN `associatedCompanies` JSON NULL;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
