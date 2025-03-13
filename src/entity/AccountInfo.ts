// This entity will store user account information
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { IsAlpha, IsAscii, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator'

@Entity()
export class AccountInfo {
  // Username will be the primary key, and should match the entry in User
  @Column({ type: 'nvarchar', length: 50 })
  @Length(1, 20, { message: 'Username must be from $constraint1 to $constraint2 characters ' })
  @IsNotEmpty({ message: 'Username is required' })
  @PrimaryColumn()
    username: string

  @Column({ type: 'nvarchar' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsAlpha('en-US', { message: 'Only A-Z letters for first name' })
  @Length(2, 12, { message: 'First name must be between $constraint1-$constraint2 characters' })
    firstName: string

  @Column({ type: 'nvarchar' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsAlpha('en-US', { message: 'Only A-Z letters for last name' })
  @Length(2, 12, { message: 'Last name must be between $constraint1-$constraint2 characters' })
    lastName: string

  @Column({ type: 'varchar' })
  @Length(7, 17, { message: 'Phone Number must be from $constraint1 to $constraint2 characters' })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsPhoneNumber('CA', { message: 'Phone number must be a Canadian phone number, Example: (000)-000-0000' })
    phone: string

  @Column({ type: 'varchar' })
  @IsNotEmpty({ message: 'Address is required' })
    address: string

  @Column({ type: 'varchar' })
  @IsNotEmpty({ message: 'City is required' })
  // Doing ASCII to include spaces, for cities that are two words like 'Moose Jaw'
  @IsAscii({ message: 'City name can only contain standard ASCII characters' })
    city: string
}
