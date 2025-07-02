## Getting Started

### 1. Goto backend folder
```bash
cd ./backend
```

### 2. Create a copy of .env.example as .env
```bash
cp .env.example .env
```

### 3. Copy the .env file to the root folder
```bash
cp .env ../.env
```

### 4. Goto frontend folder
```bash
cd ..
cd ./frontend
```

### 5. Create a copy of .env.example as .env
```bash
cp .env.example .env
```

### 6. Run docker-compose
```bash
docker-compose up -d
```

### 7. Give permissions to run the backend script
```bash
chmod +x ./backend/scripts/run_app_dev.sh
```

### 8. Use `./backend/postman` to test the API

- if you want to run backend locally use "http://127.0.0.1:3000" as {{baseUrl}} for postman 


### 9. Check app
- Frontend:  http://localhost:8000
- Backend:   http://127.0.0.1:3000


### Alternative way to run the backend
```bash
cd ./frontend && npm i && npm run dev
cd ./backend && npm i && docker-compose up -d
```
### Or
```bash
cd ./frontend && npm i && npm run dev
cd ./backend && sed -i '' 's|^DATABASE_URL=.*|DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener?schema=public|' .env
npm run start:dev
```
