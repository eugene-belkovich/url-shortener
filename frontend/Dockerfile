FROM node:20-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000
ENV PORT 8000

CMD ["npm", "run", "dev"]
