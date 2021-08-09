'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static authenticate = async function(email, password) {

      const user = await User.findOne({ where: { email } });

      // bcrypt is a one-way hashing algorithm that allows us to 
      // store strings on the database rather than the raw
      // passwords. Check out the docs for more detail
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }

      throw new Error('invalid password');
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};