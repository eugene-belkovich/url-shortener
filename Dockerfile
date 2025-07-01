FROM jod-alpine3.21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env* ./

RUN npx prisma generate

RUN npm run build

EXPOSE ${PORT}

ENV PORT 3000

CMD ["npm", "run", "start:prod"]
