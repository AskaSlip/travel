import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';


export class TicketReqDto {
  @ApiProperty({ example: 'Plane ticket' })
  @IsString()
  @Length(5, 100)
  name: string;


  @ApiProperty({ example: 'https://example.com/ticket.pdf' })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  file_url: string;
}
