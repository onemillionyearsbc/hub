/* creates the company_logo and profile_cv tables with indexes in database hubdb */

CREATE TABLE `company_logo` (
	`email` VARCHAR(100) NOT NULL,
	`id` INT(11) NOT NULL,
	`hash` CHAR(64) NOT NULL,
	`image` LONGTEXT NOT NULL,
	INDEX `key_email` (`email`),
	PRIMARY KEY (`id`)
)

CREATE TABLE `profile_cv` (
	`email` VARCHAR(100) NOT NULL,
	`hash` CHAR(64) NOT NULL,
	`image` LONGTEXT NOT NULL,
	INDEX `key_email` (`email`),
	PRIMARY KEY(`email`)
)