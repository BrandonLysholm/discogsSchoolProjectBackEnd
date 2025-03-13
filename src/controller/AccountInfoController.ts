import { Controller } from '../decorator/Controller'
import { AppDataSource } from '../data-source'
import { AccountInfo } from '../entity/AccountInfo'
import { Route } from '../decorator/Route'
import { NextFunction, Request, Response } from 'express'
import { validate, ValidationError, ValidatorOptions } from 'class-validator'

@Controller('/accountinfo')
export default class AccountInfoController {
  private readonly accountInfoRepo = AppDataSource.getRepository(AccountInfo)

  private readonly validOptions: ValidatorOptions = {
    stopAtFirstError: true,
    skipMissingProperties: false,
    validationError: { target: false, value: false }
  }

  @Route('GET')
  async all (req: Request, res: Response, next: NextFunction): Promise<AccountInfo []> {
    return await this.accountInfoRepo.find()
  }

  @Route('GET', '/:id')
  async one (req: Request, res: Response, next: NextFunction): Promise<AccountInfo> {
    return await this.accountInfoRepo.findOneBy({ username: req.params.id })
  }

  // POST can be used for create
  @Route('POST')
  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    const newAccountInfo = Object.assign(new AccountInfo(), req.body)
    const violations = await validate(newAccountInfo, this.validOptions)
    if (violations.length) {
      res.statuscode = 422
      return violations
    } else {
      return await this.accountInfoRepo.save(newAccountInfo)
    }
  }

  // PUT will handle updates
  @Route('PUT', '/:id')
  async update (req: Request, res: Response, next: NextFunction): Promise<AccountInfo | ValidationError[]> {
    const accountToUpdate = await this.accountInfoRepo.preload(req.body)
    if (!accountToUpdate || accountToUpdate.username.toString() !== req.params.id) next()
    else {
      const violations = await validate(accountToUpdate, this.validOptions)
      if (violations.length) {
        res.statusCode = 422
        return violations
      } else {
        return await this.accountInfoRepo.save(accountToUpdate)
      }
    }
  }

  @Route('DELETE', '/:id')
  async remove (req: Request, res: Response, next: NextFunction): Promise<AccountInfo> {
    const accountInfoToRemove = await this.accountInfoRepo.findOneBy({ username: req.params.id })
    return await this.accountInfoRepo.remove(accountInfoToRemove)
  }
}
