const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Reservation = require('../models/Reservation');
const Review = require('../models/Review');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Lahori seeding...');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Reservation.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    // Create default users (Mongoose pre-save hook will bypass since they are already bcrypt hashes)
    const adminPassword = await bcrypt.hash('admin123', 12);
    const staffPassword = await bcrypt.hash('staff123', 12);
    const customerPassword = await bcrypt.hash('customer123', 12);

    const users = await User.create([
      { name: 'Shahi Admin', email: 'admin@lahoretraditional.com', password: adminPassword, role: 'admin', phone: '03001234567' },
      { name: 'Lahori Chef', email: 'staff@lahoretraditional.com', password: staffPassword, role: 'staff', phone: '03009876543' },
      { name: 'Raza Khan', email: 'customer@lahoretraditional.com', password: customerPassword, role: 'customer', phone: '03005551234' }
    ]);
    console.log('Lahori Users seeded');


    const razaUser = users.find(u => u.email === 'customer@lahoretraditional.com');

    // Lahori Pakistan themed menu items
    const menuItemsData = [
      {
        name: 'Gol Gappay Shahi Platter',
        description: 'Crispy hollow semolina puris filled with spiced chickpeas, potatoes, tangy tamarind water, and sweet yogurt sauce.',
        price: 450,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600',
        dietaryTags: ['vegetarian', 'spicy'],
        preparationTime: 8,
        featured: true,
        isAvailable: true,
        customizations: [
          {
            name: 'Spice Level',
            options: [
              { label: 'Medium Tangy', priceModifier: 0 },
              { label: 'Extreme Lahori Tikha', priceModifier: 0 }
            ]
          }
        ]
      },
      {
        name: 'Peshawari Charsi Tikka',
        description: 'Succulent pieces of chicken skewered and flame-grilled with minimal spices, fresh garlic oil, and lemon.',
        price: 1200,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600',
        dietaryTags: ['halal'],
        preparationTime: 18,
        featured: false,
        isAvailable: true
      },
      {
        name: 'Traditional Roghni Naan',
        description: 'Oven-baked leavened flatbread brushed with premium ghee, sprinkled with sesame seeds.',
        price: 150,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600',
        dietaryTags: ['vegetarian'],
        preparationTime: 5,
        featured: false,
        isAvailable: true
      },
      {
        name: 'Butt Karahi Mutton Special',
        description: 'Fresh mutton slow-cooked in a traditional wok with fresh tomatoes, green chilies, ginger, and desi ghee.',
        price: 2800,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600',
        dietaryTags: ['halal', 'spicy'],
        preparationTime: 25,
        featured: true,
        isAvailable: true,
        customizations: [
          {
            name: 'Cooking Style',
            options: [
              { label: 'Desi Ghee', priceModifier: 0 },
              { label: 'Premium Butter', priceModifier: 200 }
            ]
          }
        ]
      },
      {
        name: 'Lahori Shahi Chicken Biryani',
        description: 'Layered basmati rice and chicken cooked with authentic aromatic spices, saffron, mint, and plums.',
        price: 750,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
        dietaryTags: ['halal', 'spicy'],
        preparationTime: 15,
        featured: true,
        isAvailable: true
      },
      {
        name: 'Lahori Tawa Fish',
        description: 'Marinated river fish shallow-fried on a flat iron tawa with crushed pomegranate seeds and Lahori spices.',
        price: 1850,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
        dietaryTags: ['halal', 'spicy'],
        preparationTime: 20,
        featured: true,
        isAvailable: true
      },
      {
        name: 'Shahi Seekh Kebab Platter',
        description: 'Minced beef kebabs mixed with coriander, fresh mint, and hot spices, flame-grilled to tender perfection.',
        price: 1450,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600',
        dietaryTags: ['halal'],
        preparationTime: 18,
        featured: false,
        isAvailable: true
      },
      {
        name: 'Badami Kheer',
        description: 'Slow-cooked milk and rice pudding flavored with green cardamom and saffron, garnished with slivered almonds.',
        price: 400,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
        dietaryTags: ['vegetarian', 'gluten-free'],
        preparationTime: 10,
        featured: false,
        isAvailable: true
      },
      {
        name: 'Royal Shahi Tukray',
        description: 'Fried bread slices soaked in thickened cardamon-infused milk, topped with silver leaf and pistachios.',
        price: 550,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
        dietaryTags: ['vegetarian'],
        preparationTime: 12,
        featured: true,
        isAvailable: true
      },
      {
        name: 'Lahori Kulfi Falooda',
        description: 'Rich home-made saffron kulfi served with cornstarch vermicelli, sweet rabri milk, and red rose syrup.',
        price: 600,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
        dietaryTags: ['vegetarian'],
        preparationTime: 10,
        featured: true,
        isAvailable: true
      },
      {
        name: 'Traditional Sweet Lassi',
        description: 'Chilled yogurt drink whisked with ice, sugar, and a dollop of thick fresh cream (malai).',
        price: 300,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600',
        dietaryTags: ['vegetarian', 'gluten-free'],
        preparationTime: 5,
        featured: true,
        isAvailable: true
      },
      {
        name: 'Peshawari Qahwah (Kehva)',
        description: 'Green tea brewed with cardamoms, saffron strands, and crushed almonds, served hot.',
        price: 200,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
        dietaryTags: ['vegan', 'gluten-free'],
        preparationTime: 5,
        featured: false,
        isAvailable: true
      },
      {
        name: 'Royal Mughal Thali',
        description: 'A grand feast featuring Mutton Karahi, Chicken Biryani, Seekh Kebab, Roghni Naan, Badami Kheer, and Sweet Lassi.',
        price: 4800,
        category: 'special',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
        dietaryTags: ['halal'],
        preparationTime: 40,
        featured: true,
        isAvailable: true
      }
    ];

    const seededMenuItems = await MenuItem.create(menuItemsData);
    console.log(`Lahori Menu items seeded: ${seededMenuItems.length} items`);

    // Find some seeded menu items to add reviews for
    const karahiItem = seededMenuItems.find(i => i.name === 'Butt Karahi Mutton Special');
    const biryaniItem = seededMenuItems.find(i => i.name === 'Lahori Shahi Chicken Biryani');
    const kheerItem = seededMenuItems.find(i => i.name === 'Badami Kheer');

    // Create reviews
    if (razaUser && karahiItem && biryaniItem && kheerItem) {
      await Review.create([
        { user: razaUser._id, menuItem: karahiItem._id, rating: 5, comment: 'Absolutely brilliant karahi! Desi ghee taste is unmatched in Lahore!' },
        { user: razaUser._id, menuItem: biryaniItem._id, rating: 4, comment: 'Very flavorful, perfect spice level. Plum addition was awesome.' },
        { user: razaUser._id, menuItem: kheerItem._id, rating: 5, comment: 'Perfect sweet level, served ice cold in a clay pot. Incredible.' }
      ]);
      console.log('Reviews seeded');
    }

    // Create reservations (Pending & Confirmed)
    if (razaUser) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      await Reservation.create([
        {
          user: razaUser._id,
          date: tomorrow,
          timeSlot: '07:30 PM',
          guests: 4,
          status: 'confirmed',
          tableNumber: 5,
          contactPhone: '03005551234',
          specialRequests: 'Window table facing the garden, birthday decor.'
        },
        {
          user: razaUser._id,
          date: dayAfter,
          timeSlot: '08:30 PM',
          guests: 2,
          status: 'pending',
          contactPhone: '03005551234',
          specialRequests: 'Quiet table please.'
        }
      ]);
      console.log('Reservations seeded');
    }

    // Create Historical Orders & Pending Payment Approvals for Admin Dashboards
    if (razaUser && seededMenuItems.length > 0) {
      const karahiItem = seededMenuItems.find(i => i.name === 'Butt Karahi Mutton Special');
      const biryaniItem = seededMenuItems.find(i => i.name === 'Lahori Shahi Chicken Biryani');
      const kheerItem = seededMenuItems.find(i => i.name === 'Badami Kheer');
      const lassiItem = seededMenuItems.find(i => i.name === 'Traditional Sweet Lassi');
      const naanItem = seededMenuItems.find(i => i.name === 'Traditional Roghni Naan');
      const kebabItem = seededMenuItems.find(i => i.name === 'Shahi Seekh Kebab Platter');
      const tikkaItem = seededMenuItems.find(i => i.name === 'Peshawari Charsi Tikka');
      const thaliItem = seededMenuItems.find(i => i.name === 'Royal Mughal Thali');

      const getPastDate = (daysAgo) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d;
      };

      const ordersData = [
        // 1. Order 30 Days Ago (Delivered)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01001',
          items: [
            { menuItem: karahiItem._id, name: karahiItem.name, price: karahiItem.price, quantity: 1, itemTotal: karahiItem.price },
            { menuItem: naanItem._id, name: naanItem.name, price: naanItem.price, quantity: 4, itemTotal: naanItem.price * 4 },
            { menuItem: lassiItem._id, name: lassiItem.name, price: lassiItem.price, quantity: 4, itemTotal: lassiItem.price * 4 }
          ],
          subtotal: karahiItem.price + (naanItem.price * 4) + (lassiItem.price * 4), // 2800 + 600 + 1200 = 4600
          tax: 736,
          deliveryFee: 150,
          total: 5486,
          status: 'delivered',
          paymentMethod: 'bank_transfer',
          paymentStatus: 'verified',
          transactionId: 'TXN-30DAYSAGO-1122',
          orderType: 'delivery',
          createdAt: getPastDate(30),
          updatedAt: getPastDate(30)
        },
        // 2. Order 20 Days Ago (Delivered)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01002',
          items: [
            { menuItem: biryaniItem._id, name: biryaniItem.name, price: biryaniItem.price, quantity: 2, itemTotal: biryaniItem.price * 2 },
            { menuItem: lassiItem._id, name: lassiItem.name, price: lassiItem.price, quantity: 2, itemTotal: lassiItem.price * 2 }
          ],
          subtotal: (biryaniItem.price * 2) + (lassiItem.price * 2), // 1500 + 600 = 2100
          tax: 336,
          deliveryFee: 150,
          total: 2586,
          status: 'delivered',
          paymentMethod: 'easypaisa',
          paymentStatus: 'verified',
          transactionId: 'TXN-20DAYSAGO-3344',
          orderType: 'delivery',
          createdAt: getPastDate(20),
          updatedAt: getPastDate(20)
        },
        // 3. Order 15 Days Ago (Delivered)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01003',
          items: [
            { menuItem: thaliItem._id, name: thaliItem.name, price: thaliItem.price, quantity: 1, itemTotal: thaliItem.price },
            { menuItem: kheerItem._id, name: kheerItem.name, price: kheerItem.price, quantity: 2, itemTotal: kheerItem.price * 2 }
          ],
          subtotal: thaliItem.price + (kheerItem.price * 2), // 4800 + 800 = 5600
          tax: 896,
          deliveryFee: 0,
          total: 6496,
          status: 'delivered',
          paymentMethod: 'jazzcash',
          paymentStatus: 'verified',
          transactionId: 'TXN-15DAYSAGO-5566',
          orderType: 'takeaway',
          createdAt: getPastDate(15),
          updatedAt: getPastDate(15)
        },
        // 4. Order 10 Days Ago (Delivered)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01004',
          items: [
            { menuItem: tikkaItem._id, name: tikkaItem.name, price: tikkaItem.price, quantity: 3, itemTotal: tikkaItem.price * 3 },
            { menuItem: naanItem._id, name: naanItem.name, price: naanItem.price, quantity: 6, itemTotal: naanItem.price * 6 }
          ],
          subtotal: (tikkaItem.price * 3) + (naanItem.price * 6), // 3600 + 900 = 4500
          tax: 720,
          deliveryFee: 150,
          total: 5370,
          status: 'delivered',
          paymentMethod: 'cash_on_delivery',
          paymentStatus: 'verified',
          orderType: 'delivery',
          createdAt: getPastDate(10),
          updatedAt: getPastDate(10)
        },
        // 5. Order 5 Days Ago (Delivered)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01005',
          items: [
            { menuItem: karahiItem._id, name: karahiItem.name, price: karahiItem.price, quantity: 2, itemTotal: karahiItem.price * 2 },
            { menuItem: naanItem._id, name: naanItem.name, price: naanItem.price, quantity: 8, itemTotal: naanItem.price * 8 },
            { menuItem: lassiItem._id, name: lassiItem.name, price: lassiItem.price, quantity: 4, itemTotal: lassiItem.price * 4 }
          ],
          subtotal: (karahiItem.price * 2) + (naanItem.price * 8) + (lassiItem.price * 4), // 5600 + 1200 + 1200 = 8000
          tax: 1280,
          deliveryFee: 150,
          total: 9430,
          status: 'delivered',
          paymentMethod: 'bank_transfer',
          paymentStatus: 'verified',
          transactionId: 'TXN-5DAYSAGO-7788',
          orderType: 'delivery',
          createdAt: getPastDate(5),
          updatedAt: getPastDate(5)
        },
        // 6. Order 2 Days Ago (Delivered)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01006',
          items: [
            { menuItem: biryaniItem._id, name: biryaniItem.name, price: biryaniItem.price, quantity: 4, itemTotal: biryaniItem.price * 4 }
          ],
          subtotal: biryaniItem.price * 4, // 3000
          tax: 480,
          deliveryFee: 150,
          total: 3630,
          status: 'delivered',
          paymentMethod: 'easypaisa',
          paymentStatus: 'verified',
          transactionId: 'TXN-2DAYSAGO-9900',
          orderType: 'delivery',
          createdAt: getPastDate(2),
          updatedAt: getPastDate(2)
        },
        // 7. Order 1 Day Ago - PENDING PAYMENT APPROVAL (Submitted)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01007',
          items: [
            { menuItem: kebabItem._id, name: kebabItem.name, price: kebabItem.price, quantity: 2, itemTotal: kebabItem.price * 2 },
            { menuItem: naanItem._id, name: naanItem.name, price: naanItem.price, quantity: 4, itemTotal: naanItem.price * 4 },
            { menuItem: kheerItem._id, name: kheerItem.name, price: kheerItem.price, quantity: 2, itemTotal: kheerItem.price * 2 }
          ],
          subtotal: (kebabItem.price * 2) + (naanItem.price * 4) + (kheerItem.price * 2), // 2900 + 600 + 800 = 4300
          tax: 688,
          deliveryFee: 150,
          total: 5138,
          status: 'placed',
          paymentMethod: 'jazzcash',
          paymentStatus: 'submitted',
          transactionId: 'JZC-987654321-LT',
          paymentScreenshot: '/uploads/sample_receipt.png',
          orderType: 'delivery',
          createdAt: getPastDate(1),
          updatedAt: getPastDate(1)
        },
        // 8. Order Today - PENDING PAYMENT APPROVAL (Submitted)
        {
          user: razaUser._id,
          orderNumber: 'ELV-01008',
          items: [
            { menuItem: karahiItem._id, name: karahiItem.name, price: karahiItem.price, quantity: 1, itemTotal: karahiItem.price },
            { menuItem: naanItem._id, name: naanItem.name, price: naanItem.price, quantity: 4, itemTotal: naanItem.price * 4 }
          ],
          subtotal: karahiItem.price + (naanItem.price * 4), // 2800 + 600 = 3400
          tax: 544,
          deliveryFee: 150,
          total: 4094,
          status: 'placed',
          paymentMethod: 'easypaisa',
          paymentStatus: 'submitted',
          transactionId: 'EPS-555444333-LT',
          paymentScreenshot: '/uploads/sample_receipt.png',
          orderType: 'delivery',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await Order.create(ordersData);
      console.log('Historical revenue orders and pending approvals seeded');
    }

    console.log('\n✅ Database seeded successfully with Lahore-themed culinary assets!');
    console.log('Login credentials:');
    console.log('  Admin:    admin@lahoretraditional.com / admin123');
    console.log('  Staff:    staff@lahoretraditional.com / staff123');
    console.log('  Customer: customer@lahoretraditional.com / customer123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
