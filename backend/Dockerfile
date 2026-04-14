# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- development ----------
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ---------- build ----------
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---------- production ----------
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]