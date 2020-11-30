-- MySQL Workbench Forward Engineering
SET
  @OLD_UNIQUE_CHECKS = @ @UNIQUE_CHECKS,
  UNIQUE_CHECKS = 0;
SET
  @OLD_FOREIGN_KEY_CHECKS = @ @FOREIGN_KEY_CHECKS,
  FOREIGN_KEY_CHECKS = 0;
SET
  @OLD_SQL_MODE = @ @SQL_MODE,
  SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- -----------------------------------------------------
  -- Schema
  -- -----------------------------------------------------
  -- -----------------------------------------------------
  -- Schema db
  -- -----------------------------------------------------
  DROP SCHEMA IF EXISTS `db`;
-- -----------------------------------------------------
  -- Schema db
  -- -----------------------------------------------------
  CREATE SCHEMA IF NOT EXISTS `db` DEFAULT CHARACTER SET utf8;
USE `db`;
-- -----------------------------------------------------
  -- Table `db`.`user`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `db`.`user`;
CREATE TABLE IF NOT EXISTS `db`.`user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `birthdate` DATE NULL DEFAULT NULL,
    `location` VARCHAR(45) NULL DEFAULT NULL COMMENT 'long/lat of user location/hometown',
    `bio` VARCHAR(240) NULL DEFAULT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(45) NOT NULL,
    `date_joined` DATETIME NOT NULL,
    `image_url` VARCHAR(45) NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
  ) ENGINE = InnoDB AUTO_INCREMENT = 32 DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
  -- Table `db`.`lkp_reaction`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `db`.`lkp_reaction`;
CREATE TABLE IF NOT EXISTS `db`.`lkp_reaction` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE
  ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
  -- Table `db`.`trip`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `db`.`trip`;
CREATE TABLE IF NOT EXISTS `db`.`trip` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `title` VARCHAR(45) NOT NULL,
    `body` TEXT NOT NULL,
    `price` INT NULL DEFAULT NULL,
    `origin` VARCHAR(45) NULL DEFAULT NULL,
    `destination` VARCHAR(45) NOT NULL,
    `rating` INT NOT NULL,
    `reaction_id` INT NULL DEFAULT NULL,
    `is_public` BIT(1) NOT NULL DEFAULT b '1',
    `date_created` DATETIME NOT NULL,
    `date_last_updated` DATETIME NULL DEFAULT NULL,
    `image_url` VARCHAR(100) NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
    INDEX `sentiment_id_idx` (`reaction_id` ASC) VISIBLE,
    CONSTRAINT `fk_user_trip_id` FOREIGN KEY (`user_id`) REFERENCES `db`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `reaction_id` FOREIGN KEY (`reaction_id`) REFERENCES `db`.`lkp_reaction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
  -- Table `db`.`comment`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `db`.`comment`;
CREATE TABLE IF NOT EXISTS `db`.`comment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `trip_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `parent_comment_id` INT NULL DEFAULT NULL COMMENT 'parent comment id, if null it is root comment\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nused for replies',
    `date_created` DATETIME NOT NULL,
    `body` VARCHAR(240) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
    INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
    INDEX `parent_id_idx` (`parent_comment_id` ASC) VISIBLE,
    CONSTRAINT `fk_parent_comment_id` FOREIGN KEY (`parent_comment_id`) REFERENCES `db`.`comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_trip_comment_id` FOREIGN KEY (`trip_id`) REFERENCES `db`.`trip` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_user_comment_id` FOREIGN KEY (`user_id`) REFERENCES `db`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
  -- Table `db`.`like_on_comment`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `db`.`like_on_comment`;
CREATE TABLE IF NOT EXISTS `db`.`like_on_comment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `comment_id` INT NOT NULL,
    `liked_by_user_id` INT NOT NULL,
    `is_dislike` BIT(1) NOT NULL DEFAULT b '0',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `comment_id_idx` (`comment_id` ASC) VISIBLE,
    INDEX `liked_by_user_id_idx` (`liked_by_user_id` ASC) VISIBLE,
    CONSTRAINT `fk_comment_like_on_comment_id` FOREIGN KEY (`comment_id`) REFERENCES `db`.`comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `liked_by_user_id` FOREIGN KEY (`liked_by_user_id`) REFERENCES `db`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
  -- Table `db`.`like_on_trip`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `db`.`like_on_trip`;
CREATE TABLE IF NOT EXISTS `db`.`like_on_trip` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `liked_by_user` INT NOT NULL,
    `trip_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `liked_by_user_idx` (`liked_by_user` ASC) VISIBLE,
    INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
    CONSTRAINT `fk_trip_like_on_trip_id` FOREIGN KEY (`trip_id`) REFERENCES `db`.`trip` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `liked_by_user` FOREIGN KEY (`liked_by_user`) REFERENCES `db`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARACTER SET = utf8;
-- -----------------------------------------------------
  -- Table `db`.`user_saved_trip`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `db`.`user_saved_trip`;
CREATE TABLE IF NOT EXISTS `db`.`user_saved_trip` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `trip_id` INT NOT NULL,
    `saved_by_user_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `trip_id_idx` (`trip_id` ASC) VISIBLE,
    INDEX `saved_by_user_id_idx` (`saved_by_user_id` ASC) VISIBLE,
    CONSTRAINT `fk_trip_user_saved_id` FOREIGN KEY (`trip_id`) REFERENCES `db`.`trip` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `saved_by_user_id` FOREIGN KEY (`saved_by_user_id`) REFERENCES `db`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
SET
  SQL_MODE = @OLD_SQL_MODE;
SET
  FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET
  UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;
-- -----------------------------------------------------
  -- Data for table `db`.`user`
  -- -----------------------------------------------------
  START TRANSACTION;
USE `db`;
INSERT INTO
  `db`.`user` (
    `id`,
    `name`,
    `birthdate`,
    `location`,
    `bio`,
    `email`,
    `password`,
    `date_joined`,
    `image_url`
  )
VALUES
  (
    1,
    'Nathan Gage',
    '2002-04-04T16:25:31.000Z',
    'Dallas',
    'Loading...',
    'nathan@gage.com',
    'password',
    '2020-11-28T19:23:31.000Z',
    'https://i.imgur.com/spQl1flh.jpg'
  );
INSERT INTO
  `db`.`user` (
    `id`,
    `name`,
    `birthdate`,
    `location`,
    `bio`,
    `email`,
    `password`,
    `date_joined`,
    `image_url`
  )
VALUES
  (
    2,
    'Smith Smith',
    '1990-05-03T12:00:00.000Z',
    'Everywhere',
    'I\'m just a dood',
    'smith@smith.com',
    'password',
    '2020-11-28T19:23:31.000Z',
    'https://i.imgur.com/LClZtep.jpg'
  );
COMMIT;
-- -----------------------------------------------------
  -- Data for table `db`.`lkp_reaction`
  -- -----------------------------------------------------
  START TRANSACTION;
USE `db`;
INSERT INTO
  `db`.`lkp_reaction` (`id`, `name`)
VALUES
  (1, 'Boring');
INSERT INTO
  `db`.`lkp_reaction` (`id`, `name`)
VALUES
  (2, 'Exciting');
INSERT INTO
  `db`.`lkp_reaction` (`id`, `name`)
VALUES
  (3, 'Tedious');
INSERT INTO
  `db`.`lkp_reaction` (`id`, `name`)
VALUES
  (4, 'Sad');
INSERT INTO
  `db`.`lkp_reaction` (`id`, `name`)
VALUES
  (5, 'Average');
INSERT INTO
  `db`.`lkp_reaction` (`id`, `name`)
VALUES
  (6, 'Relaxing');
COMMIT;
-- -----------------------------------------------------
  -- Data for table `db`.`trip`
  -- -----------------------------------------------------
  START TRANSACTION;
USE `db`;
INSERT INTO
  `db`.`trip` (
    `id`,
    `user_id`,
    `title`,
    `body`,
    `price`,
    `origin`,
    `destination`,
    `rating`,
    `reaction_id`,
    `is_public`,
    `date_created`,
    `date_last_updated`,
    `image_url`
  )
VALUES
  (
    1,
    1,
    'Nate\'s First Trip',
    'This was a decent trip',
    4,
    'The API',
    'Amazon RDS',
    3,
    5,
    DEFAULT,
    '2020-11-28T19:23:31.000Z',
    '2020-11-28T19:23:31.000Z',
    'https://i.imgur.com/ozjwWqC.jpeg'
  );
INSERT INTO
  `db`.`trip` (
    `id`,
    `user_id`,
    `title`,
    `body`,
    `price`,
    `origin`,
    `destination`,
    `rating`,
    `reaction_id`,
    `is_public`,
    `date_created`,
    `date_last_updated`,
    `image_url`
  )
VALUES
  (
    2,
    1,
    'Nate\'s Second Trip',
    'There was not a duck',
    1,
    'My room',
    'The Kitchen',
    5,
    4,
    DEFAULT,
    '2020-11-28T19:23:31.000Z',
    '2020-11-28T19:23:31.000Z',
    'https://i.imgur.com/iXI8q.jpeg'
  );
INSERT INTO
  `db`.`trip` (
    `id`,
    `user_id`,
    `title`,
    `body`,
    `price`,
    `origin`,
    `destination`,
    `rating`,
    `reaction_id`,
    `is_public`,
    `date_created`,
    `date_last_updated`,
    `image_url`
  )
VALUES
  (
    3,
    2,
    'Smith\'s Trip to Maui',
    'I had a lot of fun going to maui, I spent a lot of time on the beach',
    5,
    'Texas',
    'Maui',
    5,
    6,
    DEFAULT,
    '2020-11-28T19:23:31.000Z',
    '2020-11-28T19:23:31.000Z',
    'https://i.imgur.com/lF3c6aK.jpg'
  );
COMMIT;
-- -----------------------------------------------------
  -- Data for table `db`.`comment`
  -- -----------------------------------------------------
  START TRANSACTION;
USE `db`;
INSERT INTO
  `db`.`comment` (
    `id`,
    `trip_id`,
    `user_id`,
    `parent_comment_id`,
    `date_created`,
    `body`
  )
VALUES
  (
    DEFAULT,
    3,
    1,
    NULL,
    '2020-11-28T19:54:37.134Z',
    'Wow! What a cool picture'
  );
INSERT INTO
  `db`.`comment` (
    `id`,
    `trip_id`,
    `user_id`,
    `parent_comment_id`,
    `date_created`,
    `body`
  )
VALUES
  (
    DEFAULT,
    1,
    2,
    NULL,
    '2020-11-28T19:54:37.134Z',
    'Duck.'
  );
INSERT INTO
  `db`.`comment` (
    `id`,
    `trip_id`,
    `user_id`,
    `parent_comment_id`,
    `date_created`,
    `body`
  )
VALUES
  (
    DEFAULT,
    1,
    1,
    NULL,
    '2020-11-28T19:55:37.134Z',
    'Duck.'
  );
COMMIT;
-- -----------------------------------------------------
  -- Data for table `db`.`like_on_trip`
  -- -----------------------------------------------------
  START TRANSACTION;
USE `db`;
INSERT INTO
  `db`.`like_on_trip` (`id`, `liked_by_user`, `trip_id`)
VALUES
  (DEFAULT, 1, 3);
INSERT INTO
  `db`.`like_on_trip` (`id`, `liked_by_user`, `trip_id`)
VALUES
  (DEFAULT, 2, 1);
INSERT INTO
  `db`.`like_on_trip` (`id`, `liked_by_user`, `trip_id`)
VALUES
  (DEFAULT, 2, 2);
COMMIT;
-- -----------------------------------------------------
  -- Data for table `db`.`user_saved_trip`
  -- -----------------------------------------------------
  START TRANSACTION;
USE `db`;
INSERT INTO
  `db`.`user_saved_trip` (`id`, `trip_id`, `saved_by_user_id`)
VALUES
  (DEFAULT, 3, 1);
INSERT INTO
  `db`.`user_saved_trip` (`id`, `trip_id`, `saved_by_user_id`)
VALUES
  (DEFAULT, 1, 2);
COMMIT;