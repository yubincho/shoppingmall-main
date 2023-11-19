FROM node:18

RUN mkdir -p /var/app
COPY ./package.json /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["pm2-runtime", "start", "dist/main.js"]