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

### 7. Use `./backend/postman` to test the API

- if you want to run backend locally use "http://127.0.0.1:3000" as {{baseUrl}} for postman 
