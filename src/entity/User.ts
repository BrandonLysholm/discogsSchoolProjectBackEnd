import { Entity, Column, PrimaryColumn } from 'typeorm'
import { IsNotEmpty, Length } from 'class-validator'

// Modified the existing user table to use it as names for the validator using bearer tokens

@Entity()
export class User {
  @Column({ type: 'nvarchar', length: 50 })
  @Length(1, 20, { message: 'Username must be from $constraint1 to $constraint2 characters ' })
  @IsNotEmpty({ message: 'Username is required' })
  @PrimaryColumn()
    username: string

  @Column({ type: 'nvarchar', length: 20 })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(4, 20, { message: 'Password must be from $constraint1 to $constraint2 characters ' })
    password: string

  // This is used for giving people different requests, based on the type of request they gave
  // 'admin' and 'user' = GET, POST, PUT, and DELETE
  // 'user' can only POST, PUT, and DELETE for the entries associated with that username
  @Column({ type: 'nvarchar', length: 5 })
    permissionLevel: string
}
