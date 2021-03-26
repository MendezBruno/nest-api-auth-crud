[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Logger
- Winston Logger in external files log

Swagger
- Open localhost:3000/swagger to show outputs and docs


Prerequisites
- Docker and Docker Compose 
    


## Running the app

```bash
docker build -t backend .
docker-compose up

execute: 

docker exec -it [ containers mongo name ] mongo
NOTE: maybe the container name is: nest-api-auth-crud_mongodb_1

use luuna

db.users.insert({
    "_id" : ObjectId("605c95f49bff5349065e7c1b"),
    "emailVerified" : true,
    "roles" : [ 
        "admin"
    ],
    "email" : "mendezbruno.cov@gmail.com",
    "password" : "$2b$10$wFgCzBpSF2ydvH8wQDUpKeT2dJlqjmksw.q0zHwbBk31ndZBTCkji",
    "createdAt" : ISODate("2021-03-25T13:53:56.784Z"),
    "updatedAt" : ISODate("2021-03-25T13:53:56.784Z"),
    "__v" : 0
});

now can acces with mendezbruno.cov@gmail.com



```


Local or Dev
- npm install and npm start or npm run start:dev 




if have "[MongooseModule] Unable to connect to the database" error then 
you have change in development.env DB_URI and puts localhost instead mongodb
