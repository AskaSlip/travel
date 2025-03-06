import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import {AuthService} from "./services/auth.service";
import {SignUpReqDto} from "./models/dto/req/sign-up.req.dto";
import {SignInReqDto} from "./models/dto/req/sign-in.req.dto";
import {AuthResDto} from "./models/dto/res/auth.res.dto";
import {SkipAuth} from "./decorators/skip-auth.decorator";
import { IUserData } from './models/interfaces/user-data.interface';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh-guard';
import { TokenPairResDto } from './models/dto/res/token-pair.res.dto';
import { GoogleAuthGuard } from './guards/google-auth-guard';
import * as process from 'node:process';
import { PasswordReqDto } from './models/dto/req/password.req.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @SkipAuth()
    @Post('sign-up')
    public async signUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
        return  await this.authService.signUp(dto);
    }

    @SkipAuth()
    @Post('sign-in')
    public async signIn(@Body() dto: SignInReqDto):Promise<AuthResDto> {
        return  await this.authService.signIn(dto);
    }

    @ApiBearerAuth()
    @Post('sign-out')
    public async signOut(
        @CurrentUser() userData: IUserData
    ): Promise<string> {
        return await this.authService.signOut(userData);
    }

    @SkipAuth()
    @ApiBearerAuth()
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    public async refresh(
        @CurrentUser() userData: IUserData
    ): Promise<TokenPairResDto> {
        return await this.authService.refresh(userData);
    }

    @SkipAuth()
    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    public async googleLogin() {}

    //todo check with env
    @SkipAuth()
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    public async googleCallback(
        @Req() req, @Res() res
    ):Promise<void> {
        const { id } = req.user
        const tokens = await this.authService.tokensForGoogle(id)
        res.redirect(`${process.env.FRONT_URL}/auth/google-redirect?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`)
    }

    @ApiBearerAuth()
    @Post('check-password')
    public async checkPassword(
        @CurrentUser() userData: IUserData,
        @Body() dto: PasswordReqDto
    ): Promise<{message: string}> {
        return await this.authService.checkPassword(userData, dto);
    }

    @ApiBearerAuth()
    @Post('change-password')
    public async changePassword(
        @CurrentUser() userData: IUserData,
        @Body() dto: PasswordReqDto
    ): Promise<{message: string}> {
        return await this.authService.changePassword(userData, dto);
    }

    //todo forgot pass and send to email


}
