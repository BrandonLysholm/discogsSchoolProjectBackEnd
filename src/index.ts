import * as express from 'express'
import * as bodyParser from 'body-parser'
import { AppDataSource } from './data-source'
import * as createError from 'http-errors'
import { RouteDefinition } from './decorator/RouteDefinition'
import * as cors from 'cors'

// Here are my classes
import AccountInfoController from './controller/AccountInfoController'
import ArtistInfoController from './controller/ArtistInfoController'
import AlbumInfoController from './controller/AlbumInfoController'
import { validBearerTokenNeeded, authorizePermissions } from './middlewares/verify-api'
import UserController from './controller/UserController'

// https://www.toptal.com/nodejs/secure-rest-api-in-nodejs - Good tutorial on securing APIs, need to use middleware

const port = 3004
// cors options
const corsOptions = {
  origin: /localhost\:\d{4,5}$/i,
  credentials: true, // needed to set and return cookies
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  methods: 'GET,PUT,POST,DELETE',
  maxAge: 43200 // 12 hours
}

AppDataSource.initialize().then(async () => {
  // create express app
  const app = express()
  app.use(bodyParser.json())

  app.use(cors(corsOptions))
  app.options('*', cors(corsOptions)) // enabling pre-flight

  // Iterate over all our controllers and register our routes
  const controllers: any[] = [AccountInfoController,
    ArtistInfoController, AlbumInfoController]

  // here I am declaring my User routes not in the loop to bypass authentication of API calls
  const instance = new UserController()
  const path = '/user'
  const routes: RouteDefinition[] = Reflect.getMetadata('routes', UserController)
  routes.forEach((route) => {
    app[route.method.toLowerCase()](path + route.param,
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const result = instance[route.action](req, res, next)
        if (result instanceof Promise) {
          result.then((result) => result !== null && result !== undefined ? res.send(result) : next())
            .catch((err) => next(createError(404, err)))
        } else if (result !== null && result !== undefined) res.json(result)
      })
  })

  controllers.forEach((controller) => {
    // This is our instantiated class
    // eslint-disable-next-line new-cap
    const instance = new controller()
    // The prefix saved to our controller
    const path = Reflect.getMetadata('path', controller)
    // Our `routes` array containing all our routes for this controller
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', controller)

    // Iterate over all routes and register them to our express application
    // Added middleware so that all API routes are authenticated and authorized via bearer tokens
    // Checking with a database
    routes.forEach((route) => {
      // eslint-disable-next-line max-len
      app[route.method.toLowerCase()](path + route.param,
        validBearerTokenNeeded, // middleware for API authentication on all routes
        authorizePermissions, // middleware for API authorization on all routes
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
          const result = instance[route.action](req, res, next)
          if (result instanceof Promise) {
            result.then((result) => result !== null && result !== undefined ? res.send(result) : next())
              .catch((err) => next(createError(500, err)))
          } else if (result !== null && result !== undefined) res.json(result)
        })
    })
  })

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.json({
      status: err.status,
      message: err.message,
      stack: err.stack.split(/\s{4,}/)
    })
  })

  // start express server
  app.listen(port)

  console.log('Open http://localhost:' + port + '/users to see results')
}).catch(error => console.log(error))
