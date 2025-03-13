import { Controller } from '../decorator/Controller'
import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import { Route } from '../decorator/Route'

@Controller('/user')
export default class UserController {
  private readonly userRepo = AppDataSource.getRepository(User)

  // Getting a specific user that has both a correct username and password
  // the input would be /usernameVal-passwordVal
  @Route('GET', '/:cred')
  async one (req: Request, res: Response, next: NextFunction): Promise<User> {
    const stringSplit = req.params.cred.split('-')
    return await this.userRepo.findOneBy({ username: stringSplit[0], password: stringSplit[1] })
  }

  // Getting all users
  @Route('GET')
  async all (req: Request, res: Response, next: NextFunction): Promise<User[]> {
    return await this.userRepo.find()
  }
}
