import {Global, Module} from "@nestjs/common";
import {LoggerService} from "./services/logger.service";

@Global()
@Module({
    imports: [],
    providers: [LoggerService],
    exports: [LoggerService],
})

export class LoggerModule {}