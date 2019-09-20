INSERT INTO USER (US_Username, US_Password) VALUES ('Andrew', 'Test');

INSERT INTO USER (US_Username, US_Password) VALUES ('Brad', 'Test');

INSERT INTO USER (US_Username, US_Password) VALUES ('Chris', 'Test');

INSERT INTO USER (US_Username, US_Password) VALUES ('David', 'Test');

INSERT INTO USER (US_Username, US_Password) VALUES ('Ethan', 'Test');

INSERT INTO USER (US_Username, US_Password) VALUES ('Frank', 'Test');

INSERT INTO PaymentMethod (PM_US, PM_Nickname, PM_CardNumber, PM_IsPrimary) SELECT US_PK, 'MyAccount', '1111222233334444', 1 FROM User;

INSERT INTO Address (AD_US, AD_Line1, AD_Line2, AD_City, AD_State, AD_Country, AD_PostCode, AD_IsPrimary) SELECT US_PK, 'Line1', 'Line2', 'Sydney', 'New South Wales', 'Australia', '2143', 1 FROM User;

INSERT INTO Listing (LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_RemainingStock)
	SELECT US_PK, 'Logitech MX Master 3 Mouse', 'A pretty decent computer mouse', 140, 0 FROM User WHERE US_Username = 'Andrew';

INSERT INTO Listing (LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_RemainingStock)
	SELECT US_PK, 'Airpods', 'convenient af', 220, 100 FROM User WHERE US_Username = 'Brad';

INSERT INTO Listing (LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_RemainingStock)
	SELECT US_PK, 'Nvidia Titan RTX', 'At least i think thats the name', 5000, 5 FROM User WHERE US_Username = 'Chris';

INSERT INTO Listing (LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_RemainingStock)
	SELECT US_PK, 'Nokia phone', 'Indestructible', 10, 9999 FROM User WHERE US_Username = 'David';

INSERT INTO Listing (LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_RemainingStock) 
	SELECT US_PK, 'Razer blackadder keyboard', 'pretty standard stuff', 110, 30 FROM User WHERE US_Username = 'Ethan';

INSERT INTO Purchase (PC_LS, PC_PM, PC_US_Buyer, PC_AD_Delivery, PC_Price, PC_Quantity) 
	SELECT LS_PK, PM_PK, US_PK, AD_PK, 9000, 2
    FROM Listing
		LEFT JOIN User ON US_Username = 'David'
        LEFT JOIN PaymentMethod ON PM_US = US_PK AND PM_IsPrimary = 1
        LEFT JOIN Address ON AD_US = US_PK AND AD_IsPrimary = 1
    WHERE 
		LS_Title = 'Nvidia Titan RTX';