// This entity will store artist information, and rating, and it will be connected to a specific account
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsInt, IsPositive, Max, Min } from 'class-validator'

@Entity()
export class ArtistInfo {
  @PrimaryGeneratedColumn()
    artistInfoID: number

  @Column({ type: 'varchar' })
    accountID: string

  @Column({ type: 'varchar' })
  @IsInt({ message: 'Must be a whole number' })
  @IsPositive({ message: 'Must be a positive number' })
    discogsArtistID: number

  @Column({ type: 'varchar' })
    artistName: string

  @Column({ type: 'integer' })
  @Min(1, { message: 'Rating must be 1 or higher' })
  @Max(5, { message: 'Rating must be 5 or lower' })
    rating: number

  @Column({ type: 'varchar' })
    artistPic: string
}
