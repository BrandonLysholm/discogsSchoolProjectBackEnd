const AppDataSource = require('../data-source').AppDataSource
const User = require('../entity/User').User

// This is middleware that authenticates user
// called first and makes sure that in the header there is Authorization Bearer (name in database)
// If there is no authorizaation header - 401
// If there is no bearer in authorization - 401
// If the entry does not exist in DB - 403
// If it exists it goes to next middleware
exports.validBearerTokenNeeded = async (req, res, next) => {
  if (req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ')
    if (authorization[0] === 'Bearer') {
      // there is a bearer token, now need to check it
      if (await verifyUserInDB(authorization[1])) {
        return next() // moving onto the next middleware
      } else {
        return res.status(403).send() // 403 is forbidden
      }
    } else {
      // Authorization does not contain Bearer
      return res.status(401).send() // 401 is unauthorized
    }
  } else {
    // Header does not contain authorization
    return res.status(401).send() // 401 is unauthorized
  }
}

// This is middleware that authenticates user
// For POST, DELETE, and PUT the user must have stored in the db permissionLevel = write or admin
// If it does not, return 401
// If it does, call next
// For GET the user must have stored in the db permissionLevel = read, write or admin
// If it does not, return 401
// If it does, call next
exports.authorizePermissions = async (req, res, next) => {
  const authorization = req.headers.authorization.split(' ')
  if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PUT') {
    if (await authorizeWrite(authorization[1], req)) {
      // console.log('REQ is: ' + req.path)
      return next()
    } else {
      return res.status(401).send() // 401 is unauthorized
    }
  } else if (req.method === 'GET') {
    // We are making a GET request, do not need to validate
    return next()
  } else {
    return res.status(401).send() // 401 is unauthorized
  }
}

// Helper method that checks the db for write/admin permission level when passed in the username in the authorization header
// return true if it does, return false if it does not
async function authorizeWrite (username, req) {
  const userRepo = AppDataSource.getRepository(User)
  const userExists = await userRepo.findOneBy({ username })
  if (userExists.permissionLevel === 'user') {
    // https://www.tutorialspoint.com/nodejs/nodejs_request_object.htm
    const urlType = req.url.split('/')
    const url = urlType[1]
    // for users, checking to see if the entity belongs to the user
    if (url === 'accountinfo' && username === req.body.username) {
      // check that username matches req.body.username
      return true
    }
    if ((url === 'artistinfo' || url === 'albuminfo') && username === req.body.accountID) {
      // check that username matches req.body.accountID
      return true
    }
    return false
    // For admins just going to approve right away
  } else if (userExists.permissionLevel === 'admin') {
    return true
  } else {
    return false
  }
}

// Helper method that checks the db for write/admin/read permission level when passed in the username in the authorization header
// return true if it does, return false if it does not
async function authorizeRead (username) {
  const userRepo = AppDataSource.getRepository(User)
  const userExists = await userRepo.findOneBy({ username })
  // console.log(userExists)
  if (userExists.permissionLevel === 'admin' || userExists.permissionLevel === 'user' ||
    userExists.permissionLevel === 'read') {
    return true
  } else {
    return false
  }
}

// Helper method that checks that a username that is passed in exists in the database
// return true if it does, return false if it does not
async function verifyUserInDB (username) {
  // need to call the db here
  const userRepo = AppDataSource.getRepository(User)
  const userExists = await userRepo.findBy({ username })
  // console.log(userExists)
  if (userExists.length > 0) {
    return true
  } else {
    return false
  }
}
