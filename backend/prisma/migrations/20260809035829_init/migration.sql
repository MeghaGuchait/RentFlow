-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "companyName" TEXT,
    "gstNo" TEXT,
    "appliedCoupon" TEXT,
    "discountPct" REAL NOT NULL DEFAULT 0.0,
    "provider" TEXT NOT NULL DEFAULT 'password',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pricePerDay" REAL NOT NULL,
    "pricePerHour" REAL NOT NULL,
    "pricePerWeek" REAL NOT NULL,
    "securityDeposit" REAL NOT NULL,
    "inStock" INTEGER NOT NULL,
    "variants" TEXT,
    "description" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL DEFAULT 'day',
    "pickupTime" TEXT NOT NULL DEFAULT '09:00',
    "returnTime" TEXT NOT NULL DEFAULT '18:00',
    "paddingHours" REAL NOT NULL DEFAULT 1.0,
    "lateFeePerHour" REAL NOT NULL DEFAULT 10.0,
    "gracePeriodHours" REAL NOT NULL DEFAULT 1.0,
    "maxLateFee" REAL NOT NULL DEFAULT 200.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "serialNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'reserved',
    "pickupDate" DATETIME NOT NULL,
    "returnDate" DATETIME NOT NULL,
    "total" REAL NOT NULL,
    "depositHeld" REAL NOT NULL,
    "invoiceStatus" TEXT NOT NULL DEFAULT 'invoiced',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "inventoryId" TEXT,
    "qty" INTEGER NOT NULL,
    "priceSnapshot" REAL NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "validityDays" INTEGER NOT NULL DEFAULT 7,
    "paymentTermsPct" INTEGER NOT NULL DEFAULT 50,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Quotation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Return" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "actualReturnDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condition" TEXT NOT NULL DEFAULT 'good',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Return_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "hoursLate" INTEGER NOT NULL DEFAULT 0,
    "lateFee" REAL NOT NULL DEFAULT 0.0,
    "damageFee" REAL NOT NULL DEFAULT 0.0,
    "missingAccFee" REAL NOT NULL DEFAULT 0.0,
    "totalDeductions" REAL NOT NULL DEFAULT 0.0,
    "refund" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settlement_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuotationTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "validityDays" INTEGER NOT NULL,
    "paymentTermsPct" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PriceList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "rules" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayType" TEXT NOT NULL,
    "values" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "enableLateFee" BOOLEAN NOT NULL DEFAULT true,
    "globalLateFeePerHour" REAL NOT NULL DEFAULT 10.0,
    "globalGracePeriodHours" REAL NOT NULL DEFAULT 1.0,
    "maxLateFeeLimit" REAL NOT NULL DEFAULT 200.0,
    "enableAttributes" BOOLEAN NOT NULL DEFAULT true,
    "enablePriceLists" BOOLEAN NOT NULL DEFAULT true,
    "companyHeader" TEXT NOT NULL DEFAULT 'RentFlow Enterprise — Modern Equipment Rentals',
    "companyFooter" TEXT NOT NULL DEFAULT 'Thank you for renting with RentFlow! For support, contact support@rentflow.io'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_serialNumber_key" ON "Inventory"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_orderId_key" ON "Quotation"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Return_orderId_key" ON "Return"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_orderId_key" ON "Settlement"("orderId");
