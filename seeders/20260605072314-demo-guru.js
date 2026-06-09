'use strict';
const passwordHash = require('password-hash');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Memasukkan data guru ke tabel users
    await queryInterface.bulkInsert('users', [
      {
        nama: 'Guru sejarah',
        email: 'gurusejarah@classroom.com',
        password: passwordHash.generate("guru123"),
        role: 'guru',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Guru matematika',
        email: 'gurumatematika@classroom.com',
        password: passwordHash.generate("guru123"),
        role: 'guru',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus data guru
    await queryInterface.bulkDelete('users', { role: 'guru' }, {});
  }
};