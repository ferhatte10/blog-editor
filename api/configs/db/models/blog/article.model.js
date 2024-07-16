module.exports = (dbInstance, Sequelize) => {

  return dbInstance.define('article', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Identifiant unique de l'article"
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: "Titre de l'article"
    },
    description: {
      type: Sequelize.STRING(180),
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT('long'),
      allowNull: false
    },
    view_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    published_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    author_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    }
  }, 
  {
    dbInstance,
    tableName: 'article',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      }
    ]
  });
};
