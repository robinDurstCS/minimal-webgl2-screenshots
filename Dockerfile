FROM mcr.microsoft.com/playwright:v1.26.1-focal

WORKDIR /app

COPY package.json .
COPY index.js .

RUN npm install

EXPOSE 3000

CMD node index.js
