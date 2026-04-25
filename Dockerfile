# Stage 1: Build
FROM node:22-alpine AS builder
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

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

# Fail fast if build args are missing, empty, or accidentally set to a literal like "$VITE_..." in Secret Manager.
RUN set -e; \
  for v in VITE_FIREBASE_API_KEY VITE_FIREBASE_AUTH_DOMAIN VITE_FIREBASE_PROJECT_ID VITE_FIREBASE_STORAGE_BUCKET VITE_FIREBASE_MESSAGING_SENDER_ID VITE_FIREBASE_APP_ID; do \
    x="$(printenv $v 2>/dev/null || true)"; \
    if [ -z "$x" ] || printf '%s' "$x" | grep -qE '^\$VITE_'; then \
      echo "ERROR: Secret/env $v is missing/invalid. It must be the *actual* value (e.g. apiKey), not a placeholder string like '\$VITE_...'."; \
      exit 1; \
    fi; \
  done; \
  if [ -n "${VITE_FIREBASE_MEASUREMENT_ID:-}" ] && printf '%s' "$VITE_FIREBASE_MEASUREMENT_ID" | grep -qE '^\$VITE_'; then \
    echo "ERROR: VITE_FIREBASE_MEASUREMENT_ID looks like a placeholder."; \
    exit 1; \
  fi

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Handle React Router (SPA) - serve index.html for all routes
RUN printf 'server {\n  listen 8080;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
