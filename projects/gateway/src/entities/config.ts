import { ISysConfig } from 'zjf-types'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Config {
  @PrimaryColumn()
  version: string

  @Column({ type: 'json' })
  config: ISysConfig
}
