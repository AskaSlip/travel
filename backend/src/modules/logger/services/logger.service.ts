import {Injectable, Logger} from "@nestjs/common";
import * as Sentry from "@sentry/nestjs";
import {nodeProfilingIntegration} from "@sentry/profiling-node";
import {ConfigService} from "@nestjs/config";
import {Config, SentryConfig} from "../../../configs/config-type";

@Injectable()
export class LoggerService {
    private readonly isLocal: boolean;
    private readonly logger = new Logger()
constructor(private readonly configService: ConfigService<Config>) {

    const sentryConfig = this.configService.get<SentryConfig>('sentry');
    this.isLocal = sentryConfig?.env === 'local';
    Sentry.init({
        dsn: sentryConfig?.dsn,
        integrations: [
            nodeProfilingIntegration(),
        ],
        tracesSampleRate: 1.0,
        debug: sentryConfig?.debug,
        profilesSampleRate: 1.0,
    });
}

    public log(message: string): void {
        if (this.isLocal) {
            this.logger.log(message);
        } else {
            Sentry.captureMessage(message, 'log');
        }
    }
    public info(message: string): void {
        if (this.isLocal) {
            this.logger.log(message);
        } else {
            Sentry.captureMessage(message, 'info');
        }
    }
    public warn(message: string): void {
        if (this.isLocal) {
            this.logger.log(message);
        } else {
            Sentry.captureMessage(message, 'warning');
        }
    }
    public error(error: any): void {
        if (this.isLocal) {
            this.logger.error(error, error.stack);
        } else {
            Sentry.captureException(error, { level: 'error' });
        }
    }
}