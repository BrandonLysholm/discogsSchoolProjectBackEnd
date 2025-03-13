import { Controller } from '../decorator/Controller'
import { AppDataSource } from '../data-source'
import { AlbumInfo } from '../entity/AlbumInfo'
import { Route } from '../decorator/Route'
import { NextFunction, Request, Response } from 'express'
import { validate, ValidationError } from 'class-validator'
import { ArtistInfo } from '../entity/ArtistInfo'

@Controller('/albuminfo')
export default class albumInfoController {
  private readonly albumInfoRepo = AppDataSource.getRepository(AlbumInfo)
  @Route('GET')
  async all (req: Request, res: Response, next: NextFunction): Promise<AlbumInfo []> {
    return await this.albumInfoRepo.find()
  }

  @Route('GET', '/:id')
  async one (req: Request, res: Response, next: NextFunction): Promise<AlbumInfo[]> {
    return await this.albumInfoRepo.findBy({ artistID: req.params.id })
  }

  // POST can be used for create
  @Route('POST')
  async save (req: Request, res: Response, next: NextFunction): Promise<any> {
    const newAlbumInfo = Object.assign(new AlbumInfo(), req.body)
    const violations = await validate(newAlbumInfo)
    if (violations.length) {
      res.statuscode = 422
      return violations
    } else {
      return await this.albumInfoRepo.save(newAlbumInfo)
    }
  }

  // PUT will handle update
  @Route('PUT', '/:id')
  async update (req: Request, res: Response, next: NextFunction): Promise<AlbumInfo | ValidationError[]> {
    const currentEntry = await this.albumInfoRepo.findOneBy({ albumInfoID: req.params.id })
    currentEntry.rating = req.body.rating
    return await this.albumInfoRepo.save(currentEntry)
  }

  // DELETE will either take in an id only to delete an album
  // OR it will take in artist-# where the number represents
  // an artist number and then it will delete all albums
  // for that artist
  @Route('DELETE', '/:id')
  async remove (req: Request, res: Response, next: NextFunction): Promise<AlbumInfo | AlbumInfo[]> {
    const idVal = req.params.id;
    // figuring out if it includes artist
    if (idVal.includes('artist')) {
      // has artist, so splitting to access the artistID number
      const artistIDArray = req.params.id.split('-')
      const artistID = artistIDArray[1]
      // removing all albums with that artistID
      const albumsToRemove = await this.albumInfoRepo.findBy({ artistID })
      return await this.albumInfoRepo.remove(albumsToRemove)
    } else {
      // only removing a single album
      const albumInfoToRemove = await this.albumInfoRepo.findOneBy({ albumInfoID: req.params.id })
      return await this.albumInfoRepo.remove(albumInfoToRemove)
    }
  }
}
