#!/bin/sh

echo "Starting DB migration deployment........................................................."
npm run db:migrate:deploy

if [ $? -eq 0 ]; then
  echo "===========> Database migration successful."
else
  echo "-----> Database migration failed. Exiting."
  exit 1
fi

sleep 3

echo "Starting Development mode........................................................."
npm run start:dev
