
# painting-api

Fun API using Nodejs, MongoDB via mLab, Mongoose, Hapi, and Swagger.
Also utilizes Boom to send back friendly HTTP error messages on endpoint errors.

## Prerequisites

You will need the following things properly installed on your computer.

* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
* [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) — Mac: `brew install mongodb`

## Installation

* `git clone <repository-url>` this repository
* `cd painting-api`
* `yarn install`
* `yarn add hapi nodemon`
* `yarn add mongoose`
* `yarn add hapi-swagger inert vision`
* `yarn add dotenv`

## Running / Development

* `yarn run start`
* Visit api [http://localhost:3000](http://localhost:3000/)
* Get all paintings [http://localhost:3000/api/v1/paintings](http://localhost:3000/api/v1/paintings)

### Swagger Documentation

* http://localhost:3000/documentation

## Further Reading / Useful Links

* HapiJS/Boom [https://github.com/hapijs/boom](https://github.com/hapijs/boom)
* Mongoose API [https://mongoosejs.com/docs/api.htm](https://mongoosejs.com/docs/api.htm)
* Mongoose Models [https://mongoosejs.com/docs/models.html](https://mongoosejs.com/docs/models.html)
* Mongoose Async/Await [https://mongoosejs.com/docs/promises.html](https://mongoosejs.com/docs/promises.html)

* Project extended from: https://medium.freecodecamp.org/how-to-setup-a-powerful-api-with-nodejs-graphql-mongodb-hapi-and-swagger-e251ac189649
