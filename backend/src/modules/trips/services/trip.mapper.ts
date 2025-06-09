import { TripEntity } from '../../../database/entities/trip.entity';
import { TripResDto } from '../models/dto/res/trip.res.dto';
import { ListTripsQueryDto } from '../models/dto/req/list-trips-query.dto';
import { ListTripsResDto } from '../models/dto/res/list-trips.res.dto';
import { TripStopMapper } from '../../trip-stop/services/trip-stop.mapper';
import { TicketsMapper } from '../../tickets/services/tickets.mapper';
import { BudgetMapper } from '../../budget/services/budget.mapper';

export class TripMapper {
    public static toResDto(trip: Omit<TripEntity, 'created' | 'updated'>): TripResDto {
        return {
            id: trip.id,
            trip_name: trip.trip_name,
            description: trip.description,
            date_of_trip: trip.date_of_trip,
            trip_picture: trip.trip_picture,
            maxBudget: trip.maxBudget,
            tripStops: trip.tripStops
              ? trip.tripStops.map((stop) => TripStopMapper.toResDto(stop))
              : [],
            user_id: trip.user_id,
            tickets: trip.tickets ? trip.tickets.map((ticket) => TicketsMapper.toResDto(ticket)) : [],
            budgets: trip.budgets ? trip.budgets.map((budget) => BudgetMapper.toResDto(budget)) : [],
        }
    }

    public static toResDtoList(
      data: TripEntity[],
      total: number,
      query: ListTripsQueryDto,
    ): ListTripsResDto {
        return {
            data: data.map((trip) => this.toResDto(trip)),
            total,
            ...query
        };
    }


}