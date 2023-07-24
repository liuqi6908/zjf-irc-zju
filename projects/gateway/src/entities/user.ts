import { IUser } from 'zjf-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTimeStamp } from './_timestamp';

@Entity()
export class User extends BaseTimeStamp implements IUser {
  @ApiProperty({
    description: '用户的唯一标识',
    example: 'd0b0d0b0-d0b0-d0b0-d0b0-d0b0d0b0d0b0',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '手机号码',
    example: '15829296464',
    uniqueItems: true,
  })
  @Column({ unique: true })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: '邮箱',
    example: 'somebody@gmail.com',
  })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ description: '密码（加密后）' })
  @Column({ select: false })
  password: string;

  @ApiPropertyOptional({ description: '用户昵称' })
  @Column({ nullable: true })
  nickname?: string;

  @ApiPropertyOptional({ description: '头像地址' })
  @Column({ nullable: true })
  avatar?: string;
}
