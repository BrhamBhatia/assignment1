# ---------- build stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# 1) install deps
COPY package.json package-lock.json* ./
RUN npm ci

# 2) copy source
COPY . .

# 3) generate prisma client & build the app
RUN npx prisma generate
RUN npm run build

# ---------- run stage ----------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# 4) copy production build & runtime files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

EXPOSE 3000
CMD ["npm", "start"]
