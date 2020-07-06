This project is using NodeJs and Docker in stable version.
To run this project, you must have Docker and Docker Compose, first you need to run the migrations `docker-compose up`
After that you can run `docker-compose exec npx sequelize db: migrate` or if you prefer yarn `docker-compose exec yarn   sequelize db:migrate`. 
After that you can access your client running in `localhost:3000` and your api is running `localhost:3333 `
