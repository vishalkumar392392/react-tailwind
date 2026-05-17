# ─── Stage 1: Build ───────────────────────────────────────────────────────────
# Use the official Node LTS image as the build environment.
# "alpine" is a minimal Linux distro — keeps things lean.
FROM node:22-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy package files first (before source code).
# Docker caches each layer — copying package files separately means
# npm install only re-runs when dependencies actually change, not on every code edit.
COPY package.json package-lock.json ./

# Install dependencies. `npm ci` already enforces the lockfile and fails
# if package.json and package-lock.json are out of sync — no extra flag needed.
RUN npm ci

# Now copy the rest of the source code.
COPY . .

# Build the production bundle. Output lands in /app/dist
RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
# Start fresh with a tiny Nginx image. No Node, no source code, no node_modules.
FROM nginx:stable-alpine AS runner

# Copy the built static files from stage 1 into Nginx's default serve directory.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles client-side routing).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default). This is documentation — actual port mapping
# happens at `docker run` time with -p.
EXPOSE 80

# Start Nginx in the foreground (not as a daemon) so Docker can manage the process.
CMD ["nginx", "-g", "daemon off;"]
