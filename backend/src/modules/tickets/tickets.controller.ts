import { Body, Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { TicketsService } from './services/tickets.service';
import { TicketReqDto } from './models/dto/req/ticket.req';
import { TicketResDto } from './models/dto/res/ticket.res.dto';
import { TicketID, TripID } from '../../common/types/entity-ids.type';
import { TicketsMapper } from './services/tickets.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../../common/decorators/api-file.decorator';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {
  }

  @ApiBearerAuth()
  @Post('ticket/:tripId')
  public async createTicket(
    @CurrentUser() userData: IUserData,
    @Body() dto: TicketReqDto,
    @Param('tripId') tripId: TripID,
  ): Promise<TicketResDto> {
    const result = await this.ticketsService.createTicket(userData, dto, tripId);
    return TicketsMapper.toResDto(result);
  }

  // @ApiBearerAuth()
  // @Patch('ticket/:ticketId')
  // public async updateTicket(
  //   @CurrentUser() userData: IUserData,
  //   @Body() dto: TicketUpdateReq,
  //   @Param('ticketId') ticketId: TicketID
  // ): Promise<BudgetResDto> {
  //   const result = await this.ticketsService.updateTicket(userData, dto, ticketId);
  //   return TicketsMapper.toResDto(result);
  // }

  @ApiBearerAuth()
  @Delete('ticket/:ticketId')
  public async deleteTicket(
    @CurrentUser() userData: IUserData,
    @Param('ticketId') ticketId: TicketID,
  ): Promise<void> {
    await this.ticketsService.deleteTicket(userData, ticketId);
  }


  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file_url'))
  @ApiFile('file_url', false, true)
  @Post(':ticketId/file')
  public async uploadFile(
    @CurrentUser() userData: IUserData,
    @UploadedFile() file: Express.Multer.File,
    @Param('ticketId') ticketId: TicketID,
  ): Promise<TicketResDto> {
    const result = await this.ticketsService.uploadFile(userData, file, ticketId);
    return TicketsMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @Delete(':ticketId/file')
  public async deleteFile(
    @CurrentUser() userData: IUserData,
    @Param('ticketId') ticketId: TicketID,
  ): Promise<void> {
    await this.ticketsService.deleteFile(userData, ticketId);
  }
}
