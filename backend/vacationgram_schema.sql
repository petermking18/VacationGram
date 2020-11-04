-- MySQL Script generated by MySQL Workbench
-- Tue Nov  3 19:50:18 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`user` ;

CREATE TABLE IF NOT EXISTS `mydb`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `birthdate` DATE NULL,
  `location` POINT NULL COMMENT 'long/lat of user location/hometown',
  `bio` VARCHAR(240) NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `date_joined` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`lkp_trip_sentiment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`lkp_trip_sentiment` ;

CREATE TABLE IF NOT EXISTS `mydb`.`lkp_trip_sentiment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`trip`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`trip` ;

CREATE TABLE IF NOT EXISTS `mydb`.`trip` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `body` TEXT NOT NULL,
  `price` INT NULL,
  `origin` POINT NULL,
  `destination` POINT NOT NULL,
  `rating` INT NOT NULL,
  `sentiment_id` INT NULL,
  `is_public` BIT NOT NULL DEFAULT 1,
  `date_created` DATETIME NOT NULL,
  `date_last_updated` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `sentiment_id_idx` (`sentiment_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_trip_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `sentiment_id`
    FOREIGN KEY (`sentiment_id`)
    REFERENCES `mydb`.`lkp_trip_sentiment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`lkp_activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`lkp_activity` ;

CREATE TABLE IF NOT EXISTS `mydb`.`lkp_activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type_name` VARCHAR(45) NOT NULL COMMENT 'hotel, restaurant, or other activity types here.',
  `is_first_class` BIT NOT NULL DEFAULT 0 COMMENT 'first class activities are hotels & restaurants, intended to be used for searching by activity category & omitting hotels / restaurants as options to search ',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `type_name_UNIQUE` (`type_name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`trip_activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`trip_activity` ;

CREATE TABLE IF NOT EXISTS `mydb`.`trip_activity` (
  `trip_id` INT NOT NULL,
  `activity_type_id` INT NOT NULL,
  `name` VARCHAR(70) NOT NULL COMMENT 'name of activity (i.e. boating activity could named \"Boating at Lake _____\")',
  `location` POINT NULL COMMENT 'long/lat of activity\n',
  `arrival` DATE NULL,
  `departure` DATE NULL,
  `price` INT NULL,
  INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
  CONSTRAINT `fk_trip_trip_activity_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`trip` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `checkpoint_type_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`lkp_activity` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`lkp_travel_method`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`lkp_travel_method` ;

CREATE TABLE IF NOT EXISTS `mydb`.`lkp_travel_method` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `method_name` VARCHAR(45) NOT NULL COMMENT 'name of travel method type\n',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `method_name_UNIQUE` (`method_name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`travel_method_for_trip`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`travel_method_for_trip` ;

CREATE TABLE IF NOT EXISTS `mydb`.`travel_method_for_trip` (
  `trip_id` INT NOT NULL,
  `travel_method_id` INT NOT NULL,
  `departure` DATETIME NULL,
  `arrival` DATETIME NULL,
  `price` INT NULL,
  PRIMARY KEY (`trip_id`),
  INDEX `travel_method_id_idx` (`travel_method_id` ASC) VISIBLE,
  CONSTRAINT `trip_travel_method_for_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`trip` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `travel_method_id`
    FOREIGN KEY (`travel_method_id`)
    REFERENCES `mydb`.`lkp_travel_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`comment` ;

CREATE TABLE IF NOT EXISTS `mydb`.`comment` (
  `id` INT NOT NULL,
  `trip_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `parent_comment_id` INT NULL COMMENT 'parent comment id, if null it is root comment\n\nused for replies',
  `is_question` BIT NOT NULL DEFAULT 0,
  `date_created` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `parent_id_idx` (`parent_comment_id` ASC) VISIBLE,
  CONSTRAINT `fk_trip_comment_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`trip` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_comment_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `parent_id`
    FOREIGN KEY (`parent_comment_id`)
    REFERENCES `mydb`.`comment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`like_on_comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`like_on_comment` ;

CREATE TABLE IF NOT EXISTS `mydb`.`like_on_comment` (
  `comment_id` INT NOT NULL,
  `liked_by_user_id` INT NOT NULL,
  `is_dislike` BIT NOT NULL DEFAULT 0,
  INDEX `comment_id_idx` (`comment_id` ASC) VISIBLE,
  INDEX `liked_by_user_id_idx` (`liked_by_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_comment_like_on_comment_id`
    FOREIGN KEY (`comment_id`)
    REFERENCES `mydb`.`comment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `liked_by_user_id`
    FOREIGN KEY (`liked_by_user_id`)
    REFERENCES `mydb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`user_saved_trip`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`user_saved_trip` ;

CREATE TABLE IF NOT EXISTS `mydb`.`user_saved_trip` (
  `trip_id` INT NOT NULL,
  `saved_by_user_id` INT NOT NULL,
  `save_ranking` INT NOT NULL DEFAULT 0,
  INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
  INDEX `saved_by_user_id_idx` (`saved_by_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_trip_user_saved_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`trip` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `saved_by_user_id`
    FOREIGN KEY (`saved_by_user_id`)
    REFERENCES `mydb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`like_on_trip`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`like_on_trip` ;

CREATE TABLE IF NOT EXISTS `mydb`.`like_on_trip` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `liked_by_user` INT NOT NULL,
  `trip_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `liked_by_user_idx` (`liked_by_user` ASC) VISIBLE,
  INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
  CONSTRAINT `liked_by_user`
    FOREIGN KEY (`liked_by_user`)
    REFERENCES `mydb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_trip_like_on_trip_id`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`trip` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
