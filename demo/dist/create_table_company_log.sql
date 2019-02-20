/* creates the company_logo table with indexes in database hubdb */

CREATE TABLE `company_logo` (
	`email` VARCHAR(100) NOT NULL,
	`id` INT(11) NOT NULL,
	`hash` CHAR(64) NOT NULL,
	`image` LONGTEXT NOT NULL,
	INDEX `key_email` (`email`),
	INDEX `key_id` (`id`)
)