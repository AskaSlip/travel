
import {ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException} from '@nestjs/common';
import { Request, Response } from 'express';
import {LoggerService} from "../../modules/logger/services/logger.service";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly  logger: LoggerService) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let messages: string | string[];

        if (exception instanceof BadRequestException) {
            status = exception.getStatus();
            messages = (exception as any).response.message;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            messages = exception.message;
        } else {
            status = 500;
            messages = 'Internal server error';
            this.logger.error(exception);
        }

        this.logger.error(exception);
        response.status(status).json({
            statusCode: status,
            messages: Array.isArray(messages) ? messages : [messages],
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
