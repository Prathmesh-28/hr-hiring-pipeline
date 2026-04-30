FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma:generate
RUN yarn build
EXPOSE 4000
CMD ["node", "dist/index.js"]
