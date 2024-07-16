const dotenv = require("dotenv")
const assert = require("assert")

dotenv.config({ path: '.env' })

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_NAME,
    PORT,
    CORS_ORIGIN,
    DB_LOGGING,
    JWT_SECRET
} = process.env

assert(DB_HOST, "DB_HOST (database host) is required")
assert(DB_PORT, "DB_PORT (database port) is required")
assert(DB_USER, "DB_USER (database user) is required")
assert(DB_PASS, "DB_PASS (database password) is required")
assert(DB_NAME, "DB_NAME (database name) is required")
assert(CORS_ORIGIN, "CORS_ORIGIN () is required")
assert(JWT_SECRET, "JWT_SECRET is required")
module.exports = {
    SQL: {
        DB_HOST,
        DB_PORT,
        DB_USER,
        DB_PASS,
        DB_NAME,
        DB_LOGGING
    },
    PORT,
    CORS_ORIGIN: CORS_ORIGIN.split(","),
    JWT_SECRET
}
