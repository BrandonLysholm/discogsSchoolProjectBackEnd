import { Controller } from '../decorator/Controller'
import { AppDataSource } from '../data-source'
import { ArtistInfo } from '../entity/ArtistInfo'
import { Route } from '../decorator/Route'
import { NextFunction, Request, Response } from 'express'
import { validate, ValidationError } from 'class-validator'

@Controller('/artistinfo')
export default class ArtistInfoController {
  private readonly artistInfoRepo = AppDataSource.getRepository(ArtistInfo)
  @Route('GET')
  async all (req: Request, res: Response, next: NextFunction): Promise<ArtistInfo []> {
    return await this.artistInfoRepo.find()
  }

  @Route('GET', '/:id')
  async one (req: Request, res: Response, next: NextFunction): Promise<ArtistInfo []> {
    return await this.artistInfoRepo.findBy({ accountID: req.params.id })
  }

  // POST can be used for create
  @Route('POST')
  async save (req: Request, res: Response, next: NextFunction): Promise<any> {
    const newArtistInfo = Object.assign(new ArtistInfo(), req.body)
    const violations = await validate(newArtistInfo)
    if (violations.length) {
      res.statuscode = 422
      return violations
    } else {
      return await this.artistInfoRepo.save(newArtistInfo)
    }
  }

  // PUT will handle update
  @Route('PUT', '/:id')
  async update (req: Request, res: Response, next: NextFunction): Promise<ArtistInfo | ValidationError[]> {
    const currentEntry = await this.artistInfoRepo.findOneBy({ artistInfoID: req.params.id })
    currentEntry.rating = req.body.rating
    return await this.artistInfoRepo.save(currentEntry)
  }

  @Route('DELETE', '/:id')
  async remove (req: Request, res: Response, next: NextFunction): Promise<ArtistInfo> {
    const artistInfoToRemove = await this.artistInfoRepo.findOneBy({ artistInfoID: req.params.id })
    return await this.artistInfoRepo.remove(artistInfoToRemove)
  }
}
