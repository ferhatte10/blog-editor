module.exports = (dbInstance, Sequelize) => {

  return dbInstance.define('user', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    mobile: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    picture: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "default.png"
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },

  }, {
    dbInstance,
    tableName: 'user',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
