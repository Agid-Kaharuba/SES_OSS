DROP TABLE IF EXISTS Attachment;

DROP TABLE IF EXISTS Message;

DROP TABLE IF EXISTS Purchase;

DROP TABLE IF EXISTS Listing;

DROP TABLE IF EXISTS Category;

DROP TABLE IF EXISTS PaymentMethod;

DROP TABLE IF EXISTS Address;

DROP TABLE IF EXISTS Session;

DROP TABLE IF EXISTS Admin;

DROP TABLE IF EXISTS User;

CREATE TABLE User
(
  US_PK				varchar(36) NOT NULL,
  US_Username		varchar(32) NOT NULL,
  US_Password		varchar(64) NOT NULL,
  US_Email			varchar(256) DEFAULT NULL,
  US_FirstName		varchar(64) DEFAULT NULL,
  US_LastName		varchar(64) DEFAULT NULL,
  US_PhoneNumber	varchar(32) DEFAULT NULL,
  US_BirthDate		datetime DEFAULT NULL,
  US_IsActive		bit NOT NULL DEFAULT 1,
  US_JoinDate		datetime NOT NULL DEFAULT NOW(),
  PRIMARY KEY (US_PK),
  UNIQUE KEY US_PK_UNIQUE (US_PK),
  UNIQUE KEY US_Username_UNIQUE (US_Username)
);

CREATE TRIGGER GenerateUserPK BEFORE INSERT ON User FOR EACH ROW SET new.US_PK = IF (ISNULL(new.US_PK), uuid(), new.US_PK);;



CREATE TABLE Admin
(
  AD_PK 			varchar(36) NOT NULL,
  AD_US 			varchar(36) NOT NULL,
  AD_Certificate 	varchar(256) DEFAULT NULL,
  PRIMARY KEY (AD_PK),
  FOREIGN KEY (AD_US) REFERENCES User(US_PK),
  UNIQUE KEY AD_PK_UNIQUE (AD_PK)
);

CREATE TRIGGER GenerateAdminPK BEFORE INSERT ON Admin FOR EACH ROW SET new.AD_PK = IF (ISNULL(new.AD_PK), uuid(), new.AD_PK);;



CREATE TABLE Session 
(
  SS_PK 			varchar(36) NOT NULL,
  SS_US 			varchar(36) NOT NULL,
  SS_ExpiryDate 	datetime NOT NULL,
  PRIMARY KEY (SS_PK),
  FOREIGN KEY (SS_US) REFERENCES User(US_PK),
  UNIQUE KEY SS_PK_UNIQUE (SS_PK)
);

CREATE TRIGGER GenerateSessionPK BEFORE INSERT ON Session FOR EACH ROW SET new.SS_PK = IF (ISNULL(new.SS_PK), uuid(), new.SS_PK);



CREATE TABLE Address 
(
  AD_PK 		varchar(36) NOT NULL,
  AD_US 		varchar(36) NOT NULL,
  AD_Line1 		varchar(256) NULL,
  AD_Line2 		varchar(256) NULL,
  AD_City 		varchar(64) NULL,
  AD_State 		varchar(64) NULL,
  AD_Country 	varchar(64) NULL,
  AD_PostCode 	varchar(8) NULL,
  AD_IsActive	BIT NOT NULL DEFAULT 1,
  AD_IsPrimary	BIT NOT NULL DEFAULT 0,
  PRIMARY KEY (AD_PK),
  FOREIGN KEY (AD_US) REFERENCES User(US_PK),
  UNIQUE KEY AD_PK_UNIQUE (AD_PK)
);

CREATE TRIGGER GenerateAddressPK BEFORE INSERT ON Address FOR EACH ROW SET new.AD_PK = IF (ISNULL(new.AD_PK), uuid(), new.AD_PK);



CREATE TABLE PaymentMethod 
(
  PM_PK 			varchar(36) NOT NULL,
  PM_US 			varchar(36) NOT NULL,
  PM_Nickname 		varchar(64) NULL,
  PM_Name		 	varchar(64) NULL,
  PM_CardNumber		varchar(16) NULL,
  PM_Expiry			datetime NULL,
  PM_CVC		 	varchar(3) NULL,
  PM_IsActive		BIT NOT NULL DEFAULT 1,
  PM_IsPrimary		BIT NOT NULL DEFAULT 0,
  PRIMARY KEY (PM_PK),
  FOREIGN KEY (PM_US) REFERENCES User(US_PK),
  UNIQUE KEY PM_PK_UNIQUE (PM_PK)
);

CREATE TRIGGER GeneratePaymentMethodPK BEFORE INSERT ON PaymentMethod FOR EACH ROW SET new.PM_PK = IF (ISNULL(new.PM_PK), uuid(), new.PM_PK);



CREATE TABLE Listing 
(
  LS_PK 			varchar(36) NOT NULL,
  LS_US_Seller 		varchar(36) NOT NULL,
  LS_Title 			varchar(256) NULL,
  LS_Description	varchar(2048) NULL,
  LS_RemainingStock	INT NOT NULL,
  LS_Price 			decimal(10,2) NULL,			
  LS_IsActive		BIT NOT NULL DEFAULT 1,
  LS_PostedDate		datetime NOT NULL DEFAULT NOW(),
  PRIMARY KEY (LS_PK),
  FOREIGN KEY (LS_US_Seller) 	REFERENCES User(US_PK),
  UNIQUE KEY LS_PK_UNIQUE (LS_PK)
);

CREATE TRIGGER GenerateListingPK BEFORE INSERT ON Listing FOR EACH ROW SET new.LS_PK = IF (ISNULL(new.LS_PK), uuid(), new.LS_PK);



CREATE TABLE Purchase 
(
  PC_PK 				varchar(36) NOT NULL,
  PC_LS 				varchar(36) NOT NULL,
  PC_PM 				varchar(36) NOT NULL,
  PC_US_Buyer			varchar(36) NOT NULL,
  PC_AD_Delivery		varchar(36) NOT NULL,
  PC_TrackingNumber		varchar(64) NULL,
  PC_Price 				decimal(10,2) NULL,
  PC_Quantity			INT NOT NULL,
  PC_Date				datetime NOT NULL DEFAULT NOW(),
  PRIMARY KEY (PC_PK),
  FOREIGN KEY (PC_LS) 			REFERENCES Listing(LS_PK),
  FOREIGN KEY (PC_PM) 			REFERENCES PaymentMethod(PM_PK),
  FOREIGN KEY (PC_US_Buyer) 		REFERENCES User(US_PK),
  FOREIGN KEY (PC_AD_Delivery) 	REFERENCES Address(AD_PK),
  UNIQUE KEY PC_PK_UNIQUE (PC_PK)
);

CREATE TRIGGER GeneratePurchasePK BEFORE INSERT ON Purchase FOR EACH ROW SET new.PC_PK = IF (ISNULL(new.PC_PK), uuid(), new.PC_PK);



CREATE TABLE Message 
(
  MS_PK 				varchar(36) NOT NULL,
  MS_US_To				varchar(36) NOT NULL,
  MS_US_From			varchar(36) NOT NULL,
  MS_Header				varchar(128) NULL,
  MS_Body				varchar(2048) NULL,
  MS_Date				datetime NOT NULL DEFAULT NOW(),
  PRIMARY KEY (MS_PK),
  FOREIGN KEY (MS_US_To) REFERENCES User(US_PK),
  FOREIGN KEY (MS_US_From) REFERENCES User(US_PK),
  UNIQUE KEY PC_PK_UNIQUE (MS_PK)
);

CREATE TRIGGER GenerateMessagePK BEFORE INSERT ON Message FOR EACH ROW SET new.MS_PK = IF (ISNULL(new.MS_PK), uuid(), new.MS_PK);