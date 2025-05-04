import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { TripRepository } from '../../repository/services/trip.repository';
import { TicketReqDto } from '../models/dto/req/ticket.req';
import { TicketResDto } from '../models/dto/res/ticket.res.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { TicketID, TripID, UserID } from '../../../common/types/entity-ids.type';
import { TripEntity } from '../../../database/entities/trip.entity';
import { ConfigService } from '@nestjs/config';
import { AwsConfig, Config } from '../../../configs/config-type';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { keyFromUrl } from '../../../common/helpers/upload-file.helper';
import { TicketRepository } from '../../repository/services/ticket.repository';
import { TicketUpdateReq } from '../models/dto/req/ticket-update.req';
import { TicketEntity } from '../../../database/entities/ticket.entity';


@Injectable()
export class TicketsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService<Config>,
    private readonly fileStorageService: FileStorageService,
    private readonly ticketRepository: TicketRepository,
    private readonly tripRepository: TripRepository,
  ) {
  }


  public async createTicket(
    userData: IUserData,
    dto: TicketReqDto,
    tripId: TripID,
  ): Promise<TicketResDto> {
    await this.isUserExist(userData.userId);
    const trip = await this.tripRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const ticket = await this.ticketRepository.save(
      this.ticketRepository.create({
        ...dto,
        trip_id: trip.id,
      }),
    );
    return ticket;
  }


  public async updateTicket(
    userData: IUserData,
    dto: TicketUpdateReq,
    ticketId: TicketID,
  ): Promise<TicketResDto> {
    await this.isUserExist(userData.userId);
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return await this.ticketRepository.save({
      ...ticket,
      ...dto,
    });
  }

  public async deleteTicket(
    userData: IUserData,
    ticketId: TicketID,
  ): Promise<void> {
    await this.isUserExist(userData.userId);
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    await this.ticketRepository.delete({ id: ticketId });
  }


  public async uploadFile(userData: IUserData, file: Express.Multer.File, ticketId: TicketID): Promise<TicketEntity> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    await this.isUserExist(userData.userId);
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    if (!ticket) {
      throw new BadRequestException('ticket not found');
    }
    const pathToFile = await this.fileStorageService.uploadFile(
      file,
      ContentType.DOCUMENT,
      ticketId,
    );
    if (ticket.file_url) {
      const key = keyFromUrl(ticket.file_url, awsConfig);
      await this.fileStorageService.deleteFile(key);
    }
    const fileUrl = `${awsConfig.endpoint}/${awsConfig.bucketName}/${pathToFile}`;
    return await this.ticketRepository.save({
      ...ticket,
      file_url: fileUrl,
    });
  }

  public async deleteFile(userData: IUserData, ticketId: TicketID): Promise<void> {
    const awsConfig = this.configService.get<AwsConfig>('aws') as AwsConfig;
    await this.isUserExist(userData.userId);
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    if (!ticket) {
      throw new BadRequestException('ticket not found');
    }
    if (ticket.file_url) {
      const key = keyFromUrl(ticket.file_url, awsConfig);
      await this.fileStorageService.deleteFile(key);
      await this.ticketRepository.save({
        ...ticket,
        file_url: '',
      });
    }
  }


  private async isUserExist(userId: UserID) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
