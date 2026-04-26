FROM node:22-slim AS web_deps
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Build-time env for Vite (injected from Cloud Build / Secret Manager)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_BACKEND_URL

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID \
    VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN set -e; \
  for v in VITE_FIREBASE_API_KEY VITE_FIREBASE_AUTH_DOMAIN VITE_FIREBASE_PROJECT_ID VITE_FIREBASE_STORAGE_BUCKET VITE_FIREBASE_MESSAGING_SENDER_ID VITE_FIREBASE_APP_ID; do \
    x="$(printenv $v 2>/dev/null || true)"; \
    if [ -z "$x" ] || printf '%s' "$x" | grep -qE '^\$VITE_'; then \
      echo "ERROR: Secret/env $v is missing/invalid."; \
      exit 1; \
    fi; \
  done; \
  if [ -z "${VITE_BACKEND_URL:-}" ]; then \
    echo "ERROR: VITE_BACKEND_URL is missing/invalid. For single-service deploy, set it to '.' (same-origin) or your service base URL."; \
    exit 1; \
  fi

RUN npm run build

FROM node:22-slim AS api_deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci

FROM node:22-slim AS api_build
WORKDIR /app/backend
COPY --from=api_deps /app/backend/node_modules ./node_modules
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Backend runtime
COPY --from=api_deps /app/backend/node_modules ./backend/node_modules
COPY --from=api_build /app/backend/dist ./backend/dist
COPY backend/package.json ./backend/package.json

# Frontend built assets served by Express
COPY --from=web_deps /app/dist ./backend/public

ENV PORT=8080
EXPOSE 8080
CMD ["node", "backend/dist/index.js"]
