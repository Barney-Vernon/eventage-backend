const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

// 1. Initialize the MariaDB/MySQL Adapter
const adapter = new PrismaMariaDb({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'eventage_ems',
  connectionLimit: 5
});

// 2. Pass the adapter to the PrismaClient
const prisma = new PrismaClient({ adapter });

module.exports = prisma;