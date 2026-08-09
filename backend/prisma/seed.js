/**
 * prisma/seed.js
 * Seed script to populate the SQLite database with RentFlow default data.
 * Run using: npx prisma db seed
 */

const prisma = require("../config/database");

const defaultUsers = [
  {
    email: "admin@rentflow.io",
    name: "Priya Sharma",
    role: "admin",
    companyName: "RentFlow HQ",
    provider: "password",
  },
  {
    email: "vendor@rentflow.io",
    name: "Apex Rentals",
    role: "vendor",
    companyName: "Apex Rentals Ltd",
    gstNo: "27AAAAA0000A1Z5",
    provider: "password",
  },
  {
    email: "customer@rentflow.io",
    name: "John Doe",
    role: "customer",
    provider: "password",
  }
];

const categories = ["Electronics", "Furniture", "Photography", "Events", "Tools"];

const attributes = [
  { name: "Brand", displayType: "Radio", values: JSON.stringify(["Sony", "Canon", "IKEA", "DeWalt"]) },
  { name: "Color", displayType: "Pills", values: JSON.stringify(["Black", "White", "Walnut", "Grey"]) },
  { name: "Size", displayType: "Pills", values: JSON.stringify(["S", "M", "L", "XL"]) },
];

const priceLists = [
  {
    name: "Default Price List",
    isDefault: true,
    rules: JSON.stringify([{ applyOn: "All Products", priceType: "Fixed Price", minQty: 0 }]),
  },
  {
    name: "Corporate Bulk",
    isDefault: false,
    rules: JSON.stringify([{ applyOn: "All Products", priceType: "Discount", discountPct: 10, minQty: 5 }]),
  },
];

const products = [
  {
    id: "p-1",
    name: "Sony A7 IV Mirrorless Camera",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    pricePerDay: 45,
    pricePerHour: 8,
    pricePerWeek: 260,
    securityDeposit: 300,
    inStock: 6,
    variants: JSON.stringify({ Color: ["Black"], Brand: ["Sony"] }),
    periodicity: "day",
    pickupTime: "10:00",
    returnTime: "19:00",
    paddingHours: 2,
    lateFeePerHour: 15,
    gracePeriodHours: 1,
    maxLateFee: 200,
    description: "Full-frame mirrorless camera, ideal for events, portraits, and video work. Includes battery, charger, and 24-70mm lens.",
  },
  {
    id: "p-2",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
    pricePerDay: 12,
    pricePerHour: 3,
    pricePerWeek: 70,
    securityDeposit: 60,
    inStock: 14,
    variants: JSON.stringify({ Color: ["Black", "Grey"], Brand: ["IKEA"] }),
    periodicity: "week",
    pickupTime: "09:00",
    returnTime: "18:00",
    paddingHours: 1,
    lateFeePerHour: 4,
    gracePeriodHours: 2,
    maxLateFee: 60,
    description: "Breathable mesh back, adjustable lumbar support and armrests. Great for short-term WFH setups.",
  },
  {
    id: "p-3",
    name: "DeWalt Cordless Drill Set",
    category: "Tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    pricePerDay: 18,
    pricePerHour: 4,
    pricePerWeek: 95,
    securityDeposit: 80,
    inStock: 9,
    variants: JSON.stringify({ Brand: ["DeWalt"] }),
    periodicity: "day",
    pickupTime: "08:00",
    returnTime: "20:00",
    paddingHours: 0.5,
    lateFeePerHour: 6,
    gracePeriodHours: 0,
    maxLateFee: 100,
    description: "20V cordless drill/driver kit with two batteries, charger, and 30-piece bit set.",
  },
  {
    id: "p-4",
    name: "4K Projector — 5000 Lumens",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
    pricePerDay: 35,
    pricePerHour: 7,
    pricePerWeek: 190,
    securityDeposit: 150,
    inStock: 4,
    variants: JSON.stringify({ Brand: ["Sony"] }),
    periodicity: "day",
    pickupTime: "10:00",
    returnTime: "19:00",
    paddingHours: 1,
    lateFeePerHour: 10,
    gracePeriodHours: 1,
    maxLateFee: 150,
    description: "Bright, sharp 4K projection for weddings, corporate events, and outdoor movie nights.",
  },
  {
    id: "p-5",
    name: "Round Banquet Table (8-seat)",
    category: "Events",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    pricePerDay: 20,
    pricePerHour: 5,
    pricePerWeek: 110,
    securityDeposit: 90,
    inStock: 22,
    variants: JSON.stringify({ Color: ["Walnut", "White"] }),
    periodicity: "day",
    pickupTime: "09:00",
    returnTime: "21:00",
    paddingHours: 2,
    lateFeePerHour: 5,
    gracePeriodHours: 2,
    maxLateFee: 80,
    description: "Sturdy folding banquet table, seats 8 comfortably. Delivery or store pickup available.",
  },
  {
    id: "p-6",
    name: "Walnut Sofa — 3 Seater",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
    pricePerDay: 30,
    pricePerHour: 6,
    pricePerWeek: 170,
    securityDeposit: 200,
    inStock: 5,
    variants: JSON.stringify({ Color: ["Walnut", "Grey"] }),
    periodicity: "week",
    pickupTime: "09:00",
    returnTime: "18:00",
    paddingHours: 2,
    lateFeePerHour: 8,
    gracePeriodHours: 2,
    maxLateFee: 120,
    description: "Plush 3-seater sofa, perfect for staging or short-term furnished stays.",
  },
];

const quotationTemplates = [
  { name: "Home Rental Furniture", validityDays: 7, paymentTermsPct: 50 },
  { name: "Office Rental Furniture", validityDays: 14, paymentTermsPct: 30 },
];

const orders = [
  {
    id: "SO0001",
    customerName: "Wood Corner",
    productId: "p-6",
    qty: 1,
    status: "reserved",
    pickupDate: new Date("2026-08-10T18:30:00Z"),
    returnDate: new Date("2026-08-14T18:30:00Z"),
    total: 1520.0,
    depositHeld: 200.0,
    invoiceStatus: "invoiced",
  },
  {
    id: "SO0005",
    customerName: "Smith",
    productId: "p-1",
    qty: 1,
    status: "picked_up",
    pickupDate: new Date("2026-08-10T18:30:00Z"),
    returnDate: new Date("2026-08-10T20:30:00Z"),
    total: 90.0,
    depositHeld: 300.0,
    invoiceStatus: "confirmed",
  },
  {
    id: "SO0010",
    customerName: "John",
    productId: "p-4",
    qty: 1,
    status: "late_pickup", // status flow from mock
    pickupDate: new Date("2026-08-06T18:30:00Z"),
    returnDate: new Date("2026-08-10T18:30:00Z"),
    total: 140.0,
    depositHeld: 150.0,
    invoiceStatus: "invoiced",
  },
  {
    id: "SO0012",
    customerName: "Alex",
    productId: "p-3",
    qty: 2,
    status: "quotation",
    pickupDate: new Date("2026-08-03T21:00:00Z"),
    returnDate: new Date("2026-08-11T09:00:00Z"),
    total: 288.0,
    depositHeld: 160.0,
    invoiceStatus: "quotation_sent",
  },
  {
    id: "SO0020",
    customerName: "Sam",
    productId: "p-5",
    qty: 4,
    status: "cancelled",
    pickupDate: new Date("2026-08-03T21:00:00Z"),
    returnDate: new Date("2026-08-11T09:00:00Z"),
    total: 400.0,
    depositHeld: 0.0,
    invoiceStatus: "nothing_to_invoice",
  },
];

async function main() {
  console.log("Seeding started...");

  // 1. Users
  console.log("Seeding users...");
  for (const u of defaultUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // 2. Attributes
  console.log("Seeding attributes...");
  await prisma.attribute.deleteMany();
  for (const attr of attributes) {
    await prisma.attribute.create({ data: attr });
  }

  // 3. Price Lists
  console.log("Seeding price lists...");
  await prisma.priceList.deleteMany();
  for (const pl of priceLists) {
    await prisma.priceList.create({ data: pl });
  }

  // 4. Products & Inventories
  console.log("Seeding products and generating inventories...");
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });

    // Create serial-tracked inventories equal to the inStock count
    const existingCount = await prisma.inventory.count({
      where: { productId: product.id },
    });

    if (existingCount < p.inStock) {
      for (let i = existingCount + 1; i <= p.inStock; i++) {
        await prisma.inventory.create({
          data: {
            productId: product.id,
            serialNumber: `${product.id.toUpperCase()}-SN-${String(i).padStart(3, "0")}`,
            status: "available",
          },
        });
      }
    }
  }

  // 5. Quotation Templates
  console.log("Seeding quotation templates...");
  await prisma.quotationTemplate.deleteMany();
  for (const qt of quotationTemplates) {
    await prisma.quotationTemplate.create({ data: qt });
  }

  // 6. Orders & OrderItems
  console.log("Seeding orders...");
  for (const o of orders) {
    const orderData = {
      id: o.id,
      customerName: o.customerName,
      status: o.status,
      pickupDate: o.pickupDate,
      returnDate: o.returnDate,
      total: o.total,
      depositHeld: o.depositHeld,
      invoiceStatus: o.invoiceStatus,
    };

    // Upsert the Order
    const order = await prisma.order.upsert({
      where: { id: o.id },
      update: orderData,
      create: orderData,
    });

    // Seed corresponding OrderItems
    await prisma.orderItem.deleteMany({
      where: { orderId: order.id },
    });

    const product = products.find((p) => p.id === o.productId);
    const priceSnapshot = product ? product.pricePerDay : 0; // Default price snapshot

    // Link a dummy inventory slot if picked_up or reserved
    const inventory = await prisma.inventory.findFirst({
      where: { productId: o.productId },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: o.productId,
        qty: o.qty,
        priceSnapshot,
        inventoryId: inventory ? inventory.id : null,
      },
    });

    // If quotation, create a quotation record
    if (order.status === "quotation") {
      await prisma.quotation.upsert({
        where: { orderId: order.id },
        update: {},
        create: {
          orderId: order.id,
          validityDays: 7,
          paymentTermsPct: 50,
        },
      });
    }
  }

  // 7. System settings singleton
  console.log("Seeding default system settings...");
  const settingsCount = await prisma.systemSettings.count();
  if (settingsCount === 0) {
    await prisma.systemSettings.create({
      data: {
        id: 1,
        enableLateFee: true,
        globalLateFeePerHour: 10.0,
        globalGracePeriodHours: 1.0,
        maxLateFeeLimit: 200.0,
        enableAttributes: true,
        enablePriceLists: true,
        companyHeader: "RentFlow Enterprise — Modern Equipment Rentals",
        companyFooter: "Thank you for renting with RentFlow! For support, contact support@rentflow.io",
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
