import { IsArray, IsInt, IsMongoId, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AssignmentItemDto {
  @IsMongoId()
  userId: string;

  @IsInt()
  @Min(1)
  stock: number;
}

export class AssignProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentItemDto)
  assignments: AssignmentItemDto[];
}
