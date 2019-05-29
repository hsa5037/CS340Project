DROP TABLE IF EXISTS `characters_powers`;
DROP TABLE IF EXISTS `powers`;
DROP TABLE IF EXISTS `weapons`;
DROP TABLE IF EXISTS `characters`;
DROP TABLE IF EXISTS `alignment`;
DROP TABLE IF EXISTS `planets`;
DROP TABLE IF EXISTS `realms`;

CREATE TABLE `realms` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `realms` WRITE;
INSERT INTO `realms` VALUES (1, 'Midgard'), (2, 'Asgard'), (3, 'Jotunheim');
UNLOCK TABLES;




CREATE TABLE `planets` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`realm` int(11) DEFAULT NULL,
	PRIMARY KEY (`id`),
	KEY `realm` (`realm`),
	CONSTRAINT `planets_ibfk_1` FOREIGN KEY (`realm`) REFERENCES `realms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `planets` WRITE;
INSERT INTO `planets` VALUES (1, 'Earth', 1), (2, 'Asgard', 2), (3, 'Jotunheim', 3), (4, 'Halfworld', NULL), (5, 'Planet X', NULL), (6, 'Titan', NULL);
UNLOCK TABLES;





CREATE TABLE `alignment` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`alignment` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `alignment` (`alignment`)	
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `alignment` WRITE;
INSERT INTO `alignment` VALUES (1, 'Good'), (2, 'Evil'); 
UNLOCK TABLES;





CREATE TABLE `characters` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`homeplanet` int(11) DEFAULT NULL,
	`alignment` int(11) DEFAULT NULL,
	PRIMARY KEY (`id`),
	KEY `homeplanet` (`homeplanet`),
	CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`homeplanet`) REFERENCES `planets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
	KEY `alignment` (`alignment`),
	CONSTRAINT `characters_ibfk_2` FOREIGN KEY (`alignment`) REFERENCES `alignment` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `characters` WRITE;
INSERT INTO `characters` VALUES (1, 'Iron Man', 1, 1), (2, 'Captain America', 1, 1), (3, 'The Hulk', 1, 1), (4, 'Thor', 2, 1), (5, 'Hawkeye', 1, 1), (6, 'Black Widow', 1, 1), (7, 'Hela', 2, 2), (8, 'Rocket Raccoon', 4, 1), (9, 'Groot', 5, 1), (10, 'Loki', 3, 1), (11, 'Thanos', 6, 2), (12, 'Dr. Strange', 1, 1);
UNLOCK TABLES;




CREATE TABLE `weapons` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) DEFAULT NULL,
	`wielder` int(11) DEFAULT NULL,
	PRIMARY KEY (`id`),
	KEY `wielder` (`wielder`),
	CONSTRAINT `weapons_ibfk_1` FOREIGN KEY (`wielder`) REFERENCES `characters` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `weapons` WRITE;
INSERT INTO `weapons` VALUES (1, 'Mjolnir', 'Hammer', 4), (2, 'Infinity Gauntlet', 'Glove', 11), (3, 'Captain Americas Shield', 'Shield', 2), (4, 'Iron Man Armor', 'Armor', 1), (5, 'Stormbreaker', 'Axe', 4);
UNLOCK TABLES;





CREATE TABLE `powers` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `powers` WRITE;
INSERT INTO `powers` VALUES (1, 'Strength', 'Possesses above average strength'), (2, 'Intellect', 'Possesses above average intellect'), (3, 'Magic', 'Able to use magic'), (4, 'Stealth', 'Possesses above average stealth skills');
UNLOCK TABLES;




CREATE TABLE `characters_powers` (
	`cid` int(11) NOT NULL DEFAULT '0',
	`pid` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`cid`, `pid`),
	KEY `pid` (`pid`),
	CONSTRAINT `characters_powers_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `characters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT `characters_powers_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `powers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

LOCK TABLES `characters_powers` WRITE;
INSERT INTO `characters_powers` VALUES (1, 2), (2, 1), (3, 1), (3, 2), (4, 1), (4, 3), (5, 4), (6, 4), (7, 1), (7, 3), (8, 2), (9, 1), (10, 3), (10, 1), (11, 1), (11, 3), (12, 3), (12, 2);
UNLOCK TABLES;