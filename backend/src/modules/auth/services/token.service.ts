import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Config, JwtConfig} from "../../../configs/config-type";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ITokenPair} from "../models/interfaces/token-pair.interface";
import {IJwtPayload} from "../models/interfaces/jwt-payload.interface";
import {TokenType} from "../models/enums/token-type.enum";

@Injectable()
export class TokenService {
    private readonly jwtConfig: JwtConfig;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<Config>,
    ) {
        this.jwtConfig = configService.get<JwtConfig>('jwt') as JwtConfig;
    }

    public async generateAuthTokens(payload: IJwtPayload): Promise<ITokenPair> {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.jwtConfig.accessSecret,
            expiresIn: this.jwtConfig.accessExpiresIn,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.jwtConfig.refreshSecret,
            expiresIn: this.jwtConfig.refreshExpiresIn,
        });
        return { accessToken, refreshToken };
    }

    public async verifyToken(
        token: string,
        type: TokenType,
    ): Promise<IJwtPayload> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.getSecret(type),
            });
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private getSecret(type: TokenType): string {
        let secret: string;
        switch (type) {
            case TokenType.ACCESS:
                secret = this.jwtConfig.accessSecret;
                break;
            case TokenType.REFRESH:
                secret = this.jwtConfig.refreshSecret;
                break;
            default:
                throw new Error('Unknown token type');
        }
        return secret;
    }
}