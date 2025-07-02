FROM node:20-alpine3.21

WORKDIR /app

COPY package*.json ./

# (DO NOT REMOVE) Fix: Install OpenSSL before npm install.
RUN apk add --no-cache openssl

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

COPY ./scripts/run_app_dev.sh /app/scripts/run_app_dev.sh
RUN chmod +x /app/scripts/run_app_dev.sh

ENV PORT=3000

CMD ["/bin/sh", "-c", "/app/scripts/run_app_dev.sh"]
