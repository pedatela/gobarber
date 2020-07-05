import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import mongoose from 'mongoose'

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';


const models = [
  User,
  File,
  Appointment
];

class Database {
  constructor() {
    this.init();
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err) {
        if (err) {
          console.error('Failed to connect to mongo on startup - retrying in 5 sec');
          setTimeout(this.mongo(), 5000);
        }
      }
    )
  }
}

export default new Database();