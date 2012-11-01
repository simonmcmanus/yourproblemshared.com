

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `id` int(11) NOT NULL,
  `Name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `page` varchar(45) DEFAULT NULL,  
  `parent` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `comment` blob DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;





DROP TABLE IF EXISTS `email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` varchar(400) DEFAULT NULL,
  
  `isFirst` boolean DEFAULT NULL,
  `toEmail` varchar(500) DEFAULT NULL,
  `fromEmail` varchar(450) DEFAULT NULL,
  `reporter` varchar(450) DEFAULT NULL,
  `ccEmail` varchar(450) DEFAULT NULL,
  `subject` varchar(450) DEFAULT NULL,
  `messageId` blob DEFAULT NULL,
  `date` varchar(450) DEFAULT NULL,
  `htmlBody` LONGTEXT DEFAULT NULL,
  `textBody` LONGTEXT DEFAULT NULL,
  `inReplyToId` varchar(450) DEFAULT NULL,
  `referenceId` blob DEFAULT NULL,
  `body` blob DEFAULT NULL,
  `replyTo` varchar(450) DEFAULT NULL,
  `toName` varchar(450) DEFAULT NULL,
  `fromName` varchar(450) DEFAULT NULL,
  `ccName` varchar(450) DEFAULT NULL,
  `hash` blob DEFAULT NULL,
  `resolvedEpoch` varchar(450) DEFAULT NULL,
  `resolved` boolean DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-10-23 19:36:20
