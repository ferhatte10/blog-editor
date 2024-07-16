module.exports = (dbInstance, Sequelize) => {


    return dbInstance.define('user_role', {
        id: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            comment: "Identifiant unique l'asso."
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'role',
                key: 'id'
            }
        }
    }, {
        dbInstance,
        tableName: 'user_role',
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
