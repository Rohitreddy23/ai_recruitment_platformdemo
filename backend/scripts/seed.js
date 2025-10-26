const { seedDatabase } = require('../database/seedData');

console.log('Starting database seeding...');
seedDatabase();

// Exit after seeding is complete
setTimeout(() => {
  console.log('Database seeding completed!');
  process.exit(0);
}, 3000);