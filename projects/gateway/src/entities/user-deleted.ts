import type { IUserDeleted } from 'zjf-types/types/entities/user-deleted.interface'

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from './user'
import { CreatedAt } from './_timestamp'

@Entity()
export class UserDeleted extends CreatedAt implements IUserDeleted {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  userId: string

  @OneToOne(() => User, user => user.deletedRecord)
  @JoinColumn()
  user: User

  @Column()
  account: string

  @Column({ nullable: true })
  email?: string
}
