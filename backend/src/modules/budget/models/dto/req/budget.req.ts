import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';


export class BudgetReqDto {
  @ApiProperty({ example: 'accommodation' })
  @IsString()
  @Length(2, 100)
  category: string;


  @ApiProperty({ example: "100" })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  value: number;
}
