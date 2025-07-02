import {PrismaClient, User, Url} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const sampleUsers = [
  {
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'password123'
  },
  {
    email: 'jane.smith@example.com',
    username: 'janesmith',
    password: 'password456'
  }
];

const sampleUrls = [
  {originalUrl: 'https://www.google.com', slug: 'google1'},
  {originalUrl: 'https://www.github.com', slug: 'github1'},
  {originalUrl: 'https://www.stackoverflow.com', slug: 'stack01'},
  {originalUrl: 'https://www.youtube.com', slug: 'youtube'},
  {originalUrl: 'https://www.reddit.com', slug: 'reddit1'}
];

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
];

const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.15', '198.51.100.42'];

function generateRandomDate(daysBack: number = 30): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return pastDate;
}

async function seedUsers(): Promise<User[]> {
  const users: User[] = [];

  for (const userData of sampleUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.upsert({
      where: {email: userData.email},
      update: {},
      create: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        isActive: true,
        createdAt: generateRandomDate(60),
        updatedAt: new Date()
      }
    });

    users.push(user);
  }

  return users;
}

async function seedUrls(users: User[]): Promise<Url[]> {
  const urls: Url[] = [];

  for (let i = 0; i < sampleUrls.length; i++) {
    const urlData = sampleUrls[i];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const createdAt = await generateRandomDate(45);

    const url = await prisma.url.upsert({
      where: {slug: urlData.slug},
      update: {},
      create: {
        originalUrl: urlData.originalUrl,
        slug: urlData.slug,
        userId: randomUser.id,
        createdAt,
        updatedAt: createdAt
      }
    });

    urls.push(url);
  }

  return urls;
}

async function seedAnalytics(urls: Url[]): Promise<void> {
  for (let i = 0; i < 5; i++) {
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const randomIp = ipAddresses[Math.floor(Math.random() * ipAddresses.length)];
    const visitedAt = await generateRandomDate(30);

    await prisma.analytics.create({
      data: {
        urlId: randomUrl.id,
        ipAddress: randomIp,
        userAgent: randomUserAgent,
        visitedAt,
        originalUrl: randomUrl.originalUrl,
        slug: randomUrl.slug
      }
    });
  }
}

async function clearData() {
  await prisma.analytics.deleteMany({});
  await prisma.url.deleteMany({});
  await prisma.user.deleteMany({});
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...');

    await clearData();

    const users = await seedUsers();
    const urls = await seedUrls(users);
    await seedAnalytics(urls);
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
