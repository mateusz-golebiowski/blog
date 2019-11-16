'use strict';
import bcrypt from 'bcrypt'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(attributes, options) {
        return bcrypt.hash(attributes.password, 10)
            .then(hash => {
              attributes.password = hash;
            })
            .catch(err => {
              throw new Error();
            });
      }
    }

  });
  User.prototype.validPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };
  User.associate = function(models) {
    User.hasMany(models.Post);
  };
  return User;
};