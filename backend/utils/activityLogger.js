const AdminActivityLog = require('../models/AdminActivityLog');

const logAdminActivity = async (admin, actionType, targetEntity, details = '') => {
  try {
    await AdminActivityLog.create({
      admin: admin?._id || null,
      adminEmail: admin?.email || 'system@aaranyajewels.example.com',
      actionType,
      targetEntity,
      details,
    });
  } catch (err) {
    console.warn('[AdminActivityLog Warning]:', err.message);
  }
};

module.exports = { logAdminActivity };
