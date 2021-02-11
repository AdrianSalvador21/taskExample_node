const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Agrega un correo válido'
      },
      notEmpty: {
        msg: 'El correo no puede ir vacio'
      }
    },
    unique: {
      args: true,
      msg: 'Usuario ya registrado'
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El password no puede ir vacio'
      }
    }
  },
  token: {
    type: Sequelize.STRING,
  },
  expiration: {
    type: Sequelize.DATE
  },
  active: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  hooks: {
    beforeCreate(attributes, options) {
      attributes.password = bcrypt.hashSync(attributes.password, bcrypt.genSaltSync(10));
    }
  }
});

// Metoodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
  console.log('verificar password', password);
  console.log(this.password);
  return bcrypt.compareSync(password, this.password);
};

// usuario tiene multiples proyectos
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
