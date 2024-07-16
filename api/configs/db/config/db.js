const Sequelize = require("sequelize")
const {SQL} = require("../../env")
const init_models = require("../models/blog/init-models")

const CONFIGURATION = {
  host: SQL.DB_HOST,
  port: SQL.DB_PORT,
  dialect: 'mysql',
  logging: SQL.DB_LOGGING === "true" ? console.log : false
}


const dbInstance = new Sequelize(SQL.DB_NAME, SQL.DB_USER, SQL.DB_PASS, CONFIGURATION)


const db = init_models(dbInstance, Sequelize)

db.Sequelize = Sequelize
db.dbInstance = dbInstance


module.exports = db