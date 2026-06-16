const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const testLogin = async () => {
  try {
    console.log('Connecting to MongoDB using:', process.env.MONGO_URI ? 'URI exists' : 'URI missing');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const adminEmail = 'admin@eleve.com';
    const user = await User.findOne({ email: adminEmail }).select('+password');
    
    if (!user) {
      console.log(`❌ User with email "${adminEmail}" was NOT found in the database!`);
      const allUsers = await User.find({}, 'name email role');
      console.log('Current users in DB:', allUsers);
      process.exit(0);
    }

    console.log(`Found user: ${user.name} (${user.role})`);
    console.log('Hashed password in DB:', user.password);

    const bcrypt = require('bcryptjs');
    const isMatchDirect = await user.matchPassword('admin123');
    console.log(`Direct compare of "admin123": ${isMatchDirect ? '✅ MATCH!' : '❌ INVALID!'}`);

    // Let's check if it matches a double-hash
    // We simulate what a double hash looks like: we hash 'admin123' once, then check if that hash matches the DB.
    // Note: since bcrypt uses a salt, we can't just hash it and compare directly, but we can compare the first hash against the DB!
    const mockSalt = await bcrypt.genSalt(12);
    // Since we don't know the exact first hash's salt, we can check if it compares to *any* single hash of 'admin123'.
    // Wait, bcrypt.compare(plain, hash) takes the plain text and checks it. If it was double-hashed, the "plain" text passed to the second hash was the first hash.
    // So if we pass the first hash to bcrypt.compare(firstHash, dbHash), it should return true!
    // Let's find out by generating a few different single-hashes of 'admin123' and testing if they compare? No, bcrypt.compare works by using the salt from the hash itself!
    // So if the DB hash is a hash of a hash, then the input to compare must be the first hash.
    // But we don't know the salt used for the first hash during seeding!
    // Wait, yes we do! The hash in DB is the second hash. If it was double hashed during seeding, the first hash was created with some salt.
    // Wait! If the seeder ran `User.create` with a PLAIN string, how could it be double hashed?
    // Let's check: did they run the *old* seed script before?
    // Yes! But they said they ran `npm run seed` AFTER my change.
    // If they ran `npm run seed` after my change, then `User.deleteMany({})` deleted the old users, and created new ones.
    // If it created new ones with plain string 'admin123', then it should be hashed EXACTLY ONCE!
    // But why would it be invalid?
    // Let's check if the password in DB actually matches the single hash of "admin123".
    // Wait! Let's write a loop in testLogin.js that tests different possibilities of what was hashed!
    // For example, maybe there is a whitespace? "admin123 " or " admin123"?
    // Let's test matches for:
    // - "admin123"
    // - "admin@eleve.com"
    // - "admin"
    // - ""
    const testPasswords = ['admin123', 'admin123 ', ' admin123', 'admin', 'admin@eleve.com'];
    for (const testPw of testPasswords) {
      const match = await bcrypt.compare(testPw, user.password);
      console.log(`Checking "${testPw}": ${match ? '✅ MATCH!' : '❌ NO'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

testLogin();
