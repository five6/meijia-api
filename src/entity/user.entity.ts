import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {ApiTags} from '@nestjs/swagger';

@Entity()
@ApiTags()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}
