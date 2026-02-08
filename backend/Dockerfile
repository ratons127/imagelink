FROM node:20-bullseye-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install
COPY . .
RUN npm run prisma:generate || true
EXPOSE 4000
CMD ["npm","start"]
