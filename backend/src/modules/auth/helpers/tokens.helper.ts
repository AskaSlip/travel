import {TokenService} from "../services/token.service";
import {AuthCacheService} from "../services/auth-cash.service";
import {RefreshTokenRepository} from "../../repository/services/refresh-token.repository";
import {UserID} from "../../../common/types/entity-ids.type";

export class TokensHelper {
    public static async generateAndSaveTokens (
        tokenService: TokenService,
        authCacheService: AuthCacheService,
        refreshTokenRepository: RefreshTokenRepository,
        userId: UserID,
    ){
        const tokens = await tokenService.generateAuthTokens({userId});
        await Promise.all([
            authCacheService.saveToken(tokens.accessToken, userId),
            refreshTokenRepository.save(refreshTokenRepository.create({
                user_id: userId,
                refreshToken: tokens.refreshToken
            }))
        ])
        return tokens;
    }

    public static async deleteTokens(
        authCacheService: AuthCacheService,
        refreshTokenRepository: RefreshTokenRepository,
        userId: UserID,
    ){
        await Promise.all([
            authCacheService.deleteToken(userId),
            refreshTokenRepository.delete({user_id: userId})
        ])
    }

}