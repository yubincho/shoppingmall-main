FROM node:18

COPY ./package.json /myfolder/
WORKDIR /myfolder/
RUN npm install
COPY . /myfolder/
CMD npm run start:dev