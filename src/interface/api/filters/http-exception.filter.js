"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../../domain/exceptions");
/**
 * Filtro global para manejar excepciones y convertirlas en respuestas HTTP adecuadas
 */
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let code = 'INTERNAL_SERVER_ERROR';
        // Manejar excepciones HTTP de NestJS
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = exceptionResponse.message || message;
            }
            else if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
        }
        // Manejar excepciones de dominio
        else if (exception instanceof exceptions_1.EnterpriseNotFoundException) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = exception.message;
            code = 'ENTERPRISE_NOT_FOUND';
        }
        else if (exception instanceof exceptions_1.DuplicateTaxIdException) {
            status = common_1.HttpStatus.CONFLICT;
            message = exception.message;
            code = 'DUPLICATE_TAX_ID';
        }
        else if (exception instanceof exceptions_1.InvalidTaxIdFormatException) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
            code = 'INVALID_TAX_ID_FORMAT';
        }
        else if (exception instanceof exceptions_1.PartyNotFoundException) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = exception.message;
            code = 'PARTY_NOT_FOUND';
        }
        else if (exception instanceof exceptions_1.PartyNotInEnterpriseException) {
            status = common_1.HttpStatus.FORBIDDEN;
            message = exception.message;
            code = 'PARTY_NOT_IN_ENTERPRISE';
        }
        else if (exception instanceof exceptions_1.DuplicateEmailInEnterpriseException) {
            status = common_1.HttpStatus.CONFLICT;
            message = exception.message;
            code = 'DUPLICATE_EMAIL_IN_ENTERPRISE';
        }
        // Manejar otras excepciones
        else if (exception instanceof Error) {
            message = exception.message;
        }
        // Registrar la excepciu00f3n
        this.logger.error(`${request.method} ${request.url} - ${status}: ${message}`, exception instanceof Error ? exception.stack : '');
        // Enviar respuesta al cliente
        response.status(status).json({
            statusCode: status,
            code,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
