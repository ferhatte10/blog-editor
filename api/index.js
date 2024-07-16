const app = require('express')()
const {PORT} = require('./configs/env')
const { setupCors } = require('./configs/cors')
const { setupLogging } = require("./configs/logging")
const { setupBasics } = require('./configs/resReqConf')
const { setupDatabase } = require('./configs/syncDatabase')
const jwt = require('./configs/jwt')
const port = PORT || 3000

setupLogging(app) // This will log all requests to the console
setupCors(app) // This will setup cors
setupBasics(app) // This will setup the basics for the app as body parser and urlencoded ...
setupDatabase() // This will sync the database with the models (update any changes) and seed the database with the data

app.get('/api',
    (req, res) =>
    {
      return res.status(200).json(
          {
            success: true,
            message: {
              message: 'Welcome to the academy api',
            },
          });
    }
)

//AUTH MIDDLWARE JWT TO IMPLEMENT WITH jsonwebtoken
app.use(jwt())

// ERROR 401 HANDLING
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Access denied!" });
  } else {
    next(err);
  }
});

app.use('/api', require('./routes'))

app.use(`*`, (req, res) => {
  res.status(404).json({error: "Endpoint doesn't exists"})
})

app.listen(port, () => {
  console.log(`api listening on port ${port}`)
})