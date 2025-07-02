#!/bin/sh

echo "Starting DB migration deployment........................................................."
npm run db:migrate:deploy

if [ $? -eq 0 ]; then
  echo "===========> Database migration successful."
else
  echo "-----> Database migration failed. Exiting."
  exit 1
fi

echo "Seeding database with sample data........................................................."
npm run db:seed

if [ $? -eq 0 ]; then
  echo "===========> Database seeding successful."
else
  echo "-----> Database seeding failed. Continuing anyway."
fi

sleep 3

echo "Starting Development mode........................................................."
npm run start:dev
