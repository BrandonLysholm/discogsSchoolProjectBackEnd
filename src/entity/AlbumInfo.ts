// THis entity will store rating and information of an album, which is connected to a specific artist, which is connected to a specific account
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsInt, IsPositive, Max, Min } from 'class-validator'

@Entity()
export class AlbumInfo {
  @PrimaryGeneratedColumn()
    albumInfoID: number

  @Column({ type: 'varchar' })
  @IsInt({ message: 'Must be a whole number' })
  @IsPositive({ message: 'Must be a positive number' })
    discogsAlbumID: number

  @Column({ type: 'varchar' })
    albumTitle: string

  @Column({ type: 'integer' })
  @Min(1, { message: 'Rating must be 1 or higher' })
  @Max(5, { message: 'Rating must be 5 or lower' })
    rating: number

  @Column({ type: 'integer' })
  @Min(1900, { message: 'Release date must be after 1900' })
  @Max(2030, { message: 'Release date must be before 2030' })
    releaseDate: number

  @Column({ type: 'integer' })
  @IsInt({ message: 'Must be a whole number' })
  @IsPositive({ message: 'Must be a positive number' })
    artistID: number

  @Column({ type: 'varchar' })
    albumPic: string

  @Column({ type: 'varchar' })
    accountID: string
}
