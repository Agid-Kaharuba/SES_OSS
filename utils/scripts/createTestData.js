const database = require('../database');
const uuid = require("uuid");
const listing = require("../../models/listing");
require('dotenv').config();
database.createSchema();

const db = database.connectDatabase();
const password = "$2b$10$X5QqFAHk9pNBwoTI0UY9POCHF4/l7T2/GvP6NqQDMSiY7q1AzByoa"; //This is the encrypted text for the phrase 'password'
const insertUserScript = 'INSERT INTO User (US_PK, US_Username, US_Password, US_Email, US_FirstName, US_LastName, US_PhoneNumber, US_BirthDate) VALUES (?,?,?,?,?,?,?,?)';
const insertAdminScript = 'INSERT INTO Admin (AD_PK, AD_US) VALUES (?,?)';
const insertListingScript = 'INSERT INTO Listing (LS_PK, LS_US_Seller, LS_Title, LS_Description, LS_RemainingStock, LS_Price, LS_IsActive) VALUES (?,?,?,?,?,?,?)';
const insertPaymentMethodScript = 'INSERT INTO PaymentMethod (PM_PK, PM_US, PM_Nickname, PM_Name, PM_CardNumber, PM_Expiry, PM_CVC, PM_IsPrimary) VALUES (?,?,?,?,?,?,?,?)';
const insertAddressScript = 'INSERT INTO Address (AD_PK, AD_US, AD_Line1, AD_Line2, AD_City, AD_State, AD_Country, AD_PostCode, AD_IsPrimary) VALUES (?,?,?,?,?,?,?,?,?)';
const insertPurchaseScript = 'INSERT INTO Purchase (PC_PK, PC_LS, PC_PM, PC_US_Buyer, PC_AD_Delivery, PC_TrackingNumber, PC_Price, PC_Quantity) VALUES (?,?,?,?,?,?,?,?)';
const insertMessageScript = 'INSERT INTO Message (MS_PK, MS_US_To, MS_US_From, MS_Header, MS_Body) VALUES (?,?,?,?,?)';

//Creation of Test Data

var userSystemPK = newid();
var userAdminPK = newid();
var userPK1 = newid();
var userPK2 = newid();
var userPK3 = newid();
var userPK4 = newid();
var userPK5 = newid();
var userPK6 = newid();

insertUser(userSystemPK, 'System', 'system@system.com', 'Halfa', 'Byte');
insertUser(userAdminPK, 'Admin', 'web@live.com', "Administrative", "User");
insertUser(userPK1, 'ElectrekCo', 'electrekco@live.com', "Eric", "Dopper");
insertUser(userPK2, 'tmancuso2', 'tman@hotmail.com.au', "Thomas", "Mancuso");
insertUser(userPK3, 'Zarah', 'Zarah.ZZZZ@gmail.com', "Zarah", "Sibet");
insertUser(userPK4, 'davieee.d', 'davieee.d@gmail.com', "David", "De Angelis");
insertUser(userPK5, 'mattyYacht', 'matty.Y@gmail.com', "Matthew", "Yacht");
insertUser(userPK6, 'Mary', 'Mary.U@Outlook.com', "Mary", "Uy");

var adminPK = newid();
insertAdmin(adminPK, userAdminPK);

//These are hardcoded such that we can know for sure what the listingPK will be for each listing, and we can save the listingIMG in git.
var listingPK1_1 = '0281e6ab-100c-47a4-81f4-5058147ab048'; //Logitech MX Master 3 Mouse
var listingPK1_2 = '1ab1f949-e412-4377-8b92-7aa6f0023240'; //Logitech Wireless Mechanical Gaming Keyboard G613
var listingPK3_1 = '2f27ecc9-2c44-4b81-afb1-ef17a600e50c'; //Airpods
var listingPK4_1 = 'cac18e11-6d33-41d3-802a-315f81454706'; //NVIDIA Titan RTX
var listingPK4_2 = 'c8807496-b1e4-4f70-a50c-08664f62f931'; //NVIDIA GEFORCE RTX 2070 SUPER
var listingPK4_3 = '16ddb276-0fc5-40c6-ae91-9c204a67d541'; //Razer DeathStalker Gaming Keyboard
var listingPK4_4 = 'a156f17e-e57a-40e9-a1e3-c530d27e97d4'; //Intel Core i9 9900K Processor
var listingPK5_1 = '1fa0a014-4558-4815-bfa8-697caf2c46f8'; //Nokia 8 Phone

insertListing(listingPK1_1, userPK1, 'Logitech MX Master 3 Mouse', 'MX Master 3 is instant precision and infinite potential. It’s the most advanced Master Series mouse yet – designed for creatives and engineered for coders. If you can think it, you can master it.', 149.00);
insertListing(listingPK1_2, userPK1, 'Logitech Wireless Mechanical Gaming Keyboard G613', 'Logitech G613 Wireless Mechanical Gaming Keyboard experience light speed wireless, advanced mechanical performance and amazing battery life. Romer-G mechanical switches deliver quiet, precise mechanical performance and 70 million click life for incredible feel and durability. Connect via light speed for super fast 1ms report rate or connect to multiple devices with multi-host Bluetooth connectivity.', 139.00);
insertListing(listingPK3_1, userPK3, 'Airpods', 'Now with more talk time, voice-activated Siri access — and a new Wireless Charging Case — AirPods deliver an unparalleled wireless headphone experience. Simply take them out and they’re ready to use with all your devices. Put them in your ears and they connect immediately, immersing you in rich, high-quality sound. Just like magic.', 249.00);
insertListing(listingPK4_1, userPK4, 'NVIDIA Titan RTX', 'NVIDIA® TITAN RTX™ is the fastest PC graphics card ever built. It’s powered by the award-winning Turing™ architecture, bringing 130 Tensor TFLOPs of performance, 576 tensor cores, and 24 GB of ultra-fast GDDR6 memory to your PC.', 5000.00);
insertListing(listingPK4_2, userPK4, 'NVIDIA GEFORCE RTX 2070 SUPER', 'NVIDIA® GeForce® RTX 2070 SUPER™ is powered by the award-winning NVIDIA Turing™ architecture and has a superfast GPU with more cores and faster clocks to unleash your creative productivity and gaming dominance. It’s time to gear up and get super powers.', 939.00);
insertListing(listingPK4_3, userPK4, 'Razer DeathStalker Gaming Keyboard', 'The Razer DeathStalker gaming keyboard delivers merciless power when it is designed with slim keycaps for shorter travel distance and rapid-fire actuations. Your fingers will be flying across the low-profile keys at lightning speed and in comfort, executing commands for your master plan faster than enemies can react.', 134.95);
insertListing(listingPK4_4, userPK4, 'Intel Core i9 9900K Processor', 'The Intel Core i9-9900K is a 64-bit octa-core high-end performance x86 desktop microprocessor introduced by Intel in late 2018. This processor, which is based on the Coffee Lake microarchitecture, is manufactured on Intel\'s 3rd generation enhanced 14nm++ process.', 799.00);
insertListing(listingPK5_1, userPK5, 'Nokia 8 Phone', 'Nokia 8 comes with Android 9 Oreo, packed with the full spread of Google\'s most popular apps and no unnecessary extras. Plus, we’ll make sure you keep getting regular updates to help you stay on top of features and security.', 649.95);

var paymentMethodPK1_1 = newid();
var paymentMethodPK1_2 = newid();
var paymentMethodPK2_1 = newid();
var paymentMethodPK3_1 = newid();
var paymentMethodPK3_2 = newid();
var paymentMethodPK3_3 = newid();
var paymentMethodPK4_1 = newid();
var paymentMethodPK5_1 = newid();

insertPaymentMethod(paymentMethodPK1_1, userPK1, 'Everyday Spending', 'Orange Account', 1);
insertPaymentMethod(paymentMethodPK1_2, userPK1, 'Savings Account', 'Black Account', 0);
insertPaymentMethod(paymentMethodPK2_1, userPK2, 'Spendingggg', 'SpendAndEarnAccount', 1);
insertPaymentMethod(paymentMethodPK3_1, userPK3, 'VisaCard', 'Black Reward Plus', 1);
insertPaymentMethod(paymentMethodPK3_2, userPK3, 'MasterCard', 'Purple Everyday Account', 0);
insertPaymentMethod(paymentMethodPK3_3, userPK3, 'TopDog Amex', 'Black Card', 0);
insertPaymentMethod(paymentMethodPK4_1, userPK4, 'ING Account', 'Orange Everyday', 1);
insertPaymentMethod(paymentMethodPK5_1, userPK4, 'Commonwealth Bank Account', 'Teen Saver', 1);

var addressPK1_1 = newid();
var addressPK2_1 = newid();
var addressPK3_1 = newid();
var addressPK3_2 = newid();
var addressPK4_1 = newid();
var addressPK4_2 = newid();
var addressPK4_3 = newid();
var addressPK5_1 = newid();

insertAddress(addressPK1_1, userPK1, '1 Little Myers Street', '', 'ROKEWOOD', 'VIC', 1);
insertAddress(addressPK2_1, userPK2, '40 Lane Street', '', 'THE PINES', 'VIC', 1);
insertAddress(addressPK3_1, userPK3, '88 Tapleys Hill Road', '', 'SALISBURY EAST NORTHBRI AVE', 'SA', 1);
insertAddress(addressPK3_2, userPK3, '78 Passage Avenue', '', 'HOLLOWAYS BEACH', 'SA', 0);
insertAddress(addressPK4_1, userPK4, '86 Paradise Falls Road', '', 'BYAWATHA', 'VIC', 1);
insertAddress(addressPK4_2, userPK4, '50 Boonah Qld', '', 'BIARRA', 'QLD', 0);
insertAddress(addressPK4_3, userPK4, '75 Hereford Avenue', '', 'TOLDEROL', 'SA', 0);
insertAddress(addressPK5_1, userPK5, '83 Shell Road', '', 'GLENAIRE', 'NSW', 1);

var purchasePK1_1 = newid();
var purchasePK1_2 = newid();
var purchasePK2_1 = newid();
var purchasePK2_2 = newid();
var purchasePK2_3 = newid();
var purchasePK3_1 = newid();
var purchasePK3_2 = newid();
var purchasePK4_1 = newid();
var purchasePK5_1 = newid();

insertPurchase(purchasePK1_1, listingPK3_1, paymentMethodPK1_2, userPK1, addressPK1_1, 249.00);
insertPurchase(purchasePK1_2, listingPK5_1, paymentMethodPK1_2, userPK1, addressPK1_1, 649.95);
insertPurchase(purchasePK2_1, listingPK3_1, paymentMethodPK2_1, userPK2, addressPK2_1, 249.00);
insertPurchase(purchasePK2_2, listingPK5_1, paymentMethodPK2_1, userPK2, addressPK2_1, 649.95);
insertPurchase(purchasePK2_3, listingPK4_4, paymentMethodPK2_1, userPK2, addressPK2_1, 799.00);
insertPurchase(purchasePK3_1, listingPK4_4, paymentMethodPK3_1, userPK3, addressPK3_1, 799.00);
insertPurchase(purchasePK3_2, listingPK4_4, paymentMethodPK3_2, userPK3, addressPK3_2, 799.00);
insertPurchase(purchasePK4_1, listingPK3_1, paymentMethodPK4_1, userPK4, addressPK4_1, 249.00);
insertPurchase(purchasePK5_1, listingPK4_1, paymentMethodPK5_1, userPK5, addressPK5_1, 5000.00);

// listing.notifySellerOfPurchase(purchasePK1_1);
// listing.notifySellerOfPurchase(purchasePK1_2);
// listing.notifySellerOfPurchase(purchasePK2_1);
// listing.notifySellerOfPurchase(purchasePK2_2);
// listing.notifySellerOfPurchase(purchasePK2_3);
// listing.notifySellerOfPurchase(purchasePK3_1);
// listing.notifySellerOfPurchase(purchasePK3_2);
// listing.notifySellerOfPurchase(purchasePK4_1);
// listing.notifySellerOfPurchase(purchasePK5_1);

var messagePK1to3_1 = newid();
var messagePK3to1_1 = newid();
var messagePK3to5_1 = newid();

insertMessage(messagePK1to3_1, userPK3, userPK1, 'Restocking AirPods?', 'Hi, I\'m wondering if you would happen to be restocking your airpods soon? Thanks');
insertMessage(messagePK3to1_1, userPK1, userPK3, 'Re: Restocking AirPods?', 'Hey, they should restocked by midday tomorrow!');
insertMessage(messagePK3to5_1, userPK3, userPK5, 'Nokia 8.1', 'Hey do you guys have the newer Nokia 8.1 or no?');

//SQL Functions

function insertUser(US_PK, US_Username, US_Email, US_FirstName, US_LastName)
{
	var phoneNumber = '04' + getNumberOfLength(8);
	var dob = "19" + getNumberOfLength(2, 99) + "-" + getNumberOfLength(2, 12) + "-" + getNumberOfLength(2, 28) + " 00:00:00";
	db.query(insertUserScript, [US_PK, US_Username, password, US_Email, US_FirstName, US_LastName, phoneNumber, dob], handleError);
}

function insertAdmin(AD_PK, AD_US)
{
	db.query(insertAdminScript, [AD_PK, AD_US], handleError);
}

function insertListing(LS_PK, LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_IsActive = 1)
{
	var remainingStock = Math.floor(Math.random() * 20);
	db.query(insertListingScript, [LS_PK, LS_US_Seller, LS_Title, LS_Description, remainingStock, LS_Price, LS_IsActive], handleError)
}

function insertPaymentMethod(PM_PK, PM_US, PM_Nickname, PM_Name, PM_IsPrimary)
{
	var cardNumber = getNumberOfLength(16);
	var expiry = "20" + getNumberOfLength(2, 99) + "-" + getNumberOfLength(2, 12) + "-01 00:00:00";
	var cvc = getNumberOfLength(3);
	db.query(insertPaymentMethodScript, [PM_PK, PM_US, PM_Nickname, PM_Name, cardNumber, expiry, cvc, PM_IsPrimary], handleError);
}

function insertAddress(AD_PK, AD_US, AD_Line1, AD_Line2, AD_City, AD_State, AD_IsPrimary)
{
	var postCode = getNumberOfLength(4);
	var country = 'Australia';
	db.query(insertAddressScript, [AD_PK, AD_US, AD_Line1, AD_Line2, AD_City, AD_State, country, postCode, AD_IsPrimary], handleError)
}

function insertPurchase(PC_PK, PC_LS, PC_PM, PC_US_Buyer, PC_AD_Delivery, individualPrice)
{
	var trackingNumber = getNumberOfLength(24);
	var quantity = Math.ceil(Math.random() * 4);
	var price = individualPrice * quantity;
	db.query(insertPurchaseScript, [PC_PK, PC_LS, PC_PM, PC_US_Buyer, PC_AD_Delivery, trackingNumber, price, quantity], handleError)
}

function insertMessage(MS_PK, MS_US_To, MS_US_From, MS_Header, MS_Body)
{
	db.query(insertMessageScript, [MS_PK, MS_US_To, MS_US_From, MS_Header, MS_Body], handleError)
}


//Helper Functions
function handleError(err)
{
	if (err) throw err;
}

function newid() { return uuid.v4(); }
function getNumberOfLength(length, maxNumber)
{
	if (maxNumber == null)
	{
		maxNumber = 10**length;
	}
	return Math.ceil(Math.random() * maxNumber).toString().padStart(length, '0');
}
console.log("Test data generation complete.")