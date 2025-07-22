-- AlterTable
ALTER TABLE `question` MODIFY `type` ENUM('EMOJI', 'INPUT', 'CHOICE', 'RATE', 'SECTION') NOT NULL;
