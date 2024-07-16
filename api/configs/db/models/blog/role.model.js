module.exports = (dbInstance, Sequelize) => {

    return dbInstance.define('role', {
        id: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(20),
            allowNull: false
        }

    }, {
        dbInstance,
        tableName: 'role',
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
