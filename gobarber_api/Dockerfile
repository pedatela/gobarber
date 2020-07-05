FROM node:erbium-stretch

WORKDIR /usr/src/gobarber_api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3333

ENV NODE_ENV=development
ENV APP_URL=http://localhost:3333

#AUTH
ENV APP_SECRET=8538607221f2e42284acf599214cfa34

# POSTGRES
ENV DB_HOST=
ENV DB_USER=
ENV DB_PASSWORD=
ENV DB_NAME= 

# SENTRY
ENV SENTRY_DNS=

# MONGO
ENV MONGO_URL=mongodb://mongo:27017/gobarber

#MAIL
ENV MAIL_HOST=smtp.mailtrap.io
ENV MAIL_PORT=2525
ENV MAIL_USER=eaea850a8b3746
ENV MAIL_PASS=291b4030bd3da1

#Redis
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

CMD [ "npm", "start" ]
