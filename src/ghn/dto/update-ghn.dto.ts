import { PartialType } from '@nestjs/swagger';
import { CreateGhnDto } from './create-ghn.dto';

export class UpdateGhnDto extends PartialType(CreateGhnDto) {}
