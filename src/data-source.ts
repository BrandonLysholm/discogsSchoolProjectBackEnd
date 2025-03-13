import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'
import { AccountInfo } from './entity/AccountInfo'
import { AlbumInfo } from './entity/AlbumInfo'
import { ArtistInfo } from './entity/ArtistInfo'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'sqlite.db',
  synchronize: true,
  logging: false,
  entities: [User, AccountInfo, AlbumInfo, ArtistInfo],
  migrations: [],
  subscribers: []
})
