-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db` DEFAULT CHARACTER SET utf8 ;
USE `db` ;

-- -----------------------------------------------------
-- Table `db`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usercol` VARCHAR(45) NULL,
  `name` VARCHAR(45) NOT NULL,
  `birthdate` DATE NULL DEFAULT NULL,
  `location` POINT NULL DEFAULT NULL COMMENT 'long/lat of user location/hometown',
  `bio` VARCHAR(240) NULL DEFAULT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `date_joined` DATETIME NOT NULL,
  `username` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `db`.`lkp_trip_sentiment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`lkp_trip_sentiment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `db`.`trip`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`trip` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `body` TEXT NOT NULL,
  `price` INT NULL DEFAULT NULL,
  `origin` POINT NULL DEFAULT NULL,
  `destination` POINT NOT NULL,
  `rating` INT NOT NULL,
  `sentiment_id` INT NULL DEFAULT NULL,
  `is_public` BIT(1) NOT NULL DEFAULT b'1',
  `date_created` DATETIME NOT NULL,
  `date_last_updated` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `sentiment_id_idx` (`sentiment_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_trip_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `db`.`user` (`id`),
  CONSTRAINT `sentiment_id`
    FOREIGN KEY (`sentiment_id`)
    REFERENCES `db`.`lkp_trip_sentiment` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `db`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`comment` (
  `id` INT NOT NULL,
  `trip_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `parent_comment_id` INT NULL DEFAULT NULL COMMENT 'parent comment id, if null it is root comment\\n\\nused for replies',
  `is_question` BIT(1) NOT NULL DEFAULT b'0',
  `date_created` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `parent_id_idx` (`parent_comment_id` ASC) VISIBLE,
  CONSTRAINT `fk_trip_comment_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `db`.`trip` (`id`),
  CONSTRAINT `fk_user_comment_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `db`.`user` (`id`),
  CONSTRAINT `parent_id`
    FOREIGN KEY (`parent_comment_id`)
    REFERENCES `db`.`comment` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `db`.`like_on_comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`like_on_comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comment_id` INT NOT NULL,
  `liked_by_user_id` INT NOT NULL,
  `is_dislike` BIT(1) NOT NULL DEFAULT b'0',
  INDEX `comment_id_idx` (`comment_id` ASC) VISIBLE,
  INDEX `liked_by_user_id_idx` (`liked_by_user_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_comment_like_on_comment_id`
    FOREIGN KEY (`comment_id`)
    REFERENCES `db`.`comment` (`id`),
  CONSTRAINT `liked_by_user_id`
    FOREIGN KEY (`liked_by_user_id`)
    REFERENCES `db`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `db`.`like_on_trip`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`like_on_trip` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `liked_by_user` INT NOT NULL,
  `trip_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `liked_by_user_idx` (`liked_by_user` ASC) VISIBLE,
  INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
  CONSTRAINT `fk_trip_like_on_trip_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `db`.`trip` (`id`),
  CONSTRAINT `liked_by_user`
    FOREIGN KEY (`liked_by_user`)
    REFERENCES `db`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `db`.`user_saved_trip`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`user_saved_trip` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `trip_id` INT NOT NULL,
  `saved_by_user_id` INT NOT NULL,
  `save_ranking` INT NOT NULL DEFAULT '0',
  INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
  INDEX `saved_by_user_id_idx` (`saved_by_user_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_trip_user_saved_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `db`.`trip` (`id`),
  CONSTRAINT `saved_by_user_id`
    FOREIGN KEY (`saved_by_user_id`)
    REFERENCES `db`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
