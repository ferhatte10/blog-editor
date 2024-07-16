const db = require('./db/config/db')

exports.setupDatabase = () => {
    db.dbInstance.sync().then(() => { // This will sync the database with the models (update any changes)
        console.log("Database is synced")
    }).catch((err) => {
        console.log(err)
    })
}