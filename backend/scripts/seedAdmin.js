require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const seedInitialAdmin = async () => {
  try {
    await connectDB();

    const {
      ADMIN_SETUP_SECRET,
      INITIAL_ADMIN_NAME,
      INITIAL_ADMIN_EMAIL,
      INITIAL_ADMIN_PASSWORD,
    } = process.env;

    if (!ADMIN_SETUP_SECRET || !INITIAL_ADMIN_EMAIL || !INITIAL_ADMIN_PASSWORD) {
      console.error(
        'Error: ADMIN_SETUP_SECRET, INITIAL_ADMIN_EMAIL, and INITIAL_ADMIN_PASSWORD must be set in .env'
      );
      process.exit(1);
    }

    const existing = await Admin.findOne({ email: INITIAL_ADMIN_EMAIL.toLowerCase().trim() });
    if (existing) {
      console.log(`[SeedAdmin] Admin ${INITIAL_ADMIN_EMAIL} already exists. Updating password...`);
      existing.password = INITIAL_ADMIN_PASSWORD;
      existing.name = INITIAL_ADMIN_NAME || existing.name;
      await existing.save();
      console.log('[SeedAdmin] Admin credentials updated securely.');
      process.exit(0);
    }

    await Admin.create({
      name: INITIAL_ADMIN_NAME || 'AARANYA Store Director',
      email: INITIAL_ADMIN_EMAIL.toLowerCase().trim(),
      password: INITIAL_ADMIN_PASSWORD,
      role: 'superadmin',
      isActive: true,
    });

    console.log(`[SeedAdmin] Initial superadmin (${INITIAL_ADMIN_EMAIL}) created successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('[SeedAdmin Failed]:', error.message);
    process.exit(1);
  }
};

seedInitialAdmin();
