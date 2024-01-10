FROM alpine:latest
RUN apk add --update nodejs npm
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run","dev"]