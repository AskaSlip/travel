import {Global, Module} from "@nestjs/common";
import {UserRepository} from "./services/user.repository";
import {RefreshTokenRepository} from "./services/refresh-token.repository";
import { TripRepository } from './services/trip.repository';
import { TripStopsRepository } from './services/trip-stops.repository';
import { TicketRepository } from './services/ticket.repository';


const repositories = [
    UserRepository,
    RefreshTokenRepository,
    TripRepository,
    TripStopsRepository,
    TicketRepository,
]

@Global()
@Module({
    providers: [...repositories],
    exports: [...repositories],
})
export class RepositoryModule {}