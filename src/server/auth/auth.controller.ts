import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get('test')
  testEnv() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    return {
      message: 'Environment Variable Check',
      googleClientId: clientId ? clientId.substring(0, 10) + '...' : 'MISSING',
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = await this.authService.validateGoogleUser(req.user);

    // Redirect ke frontend dengan token
    // Encode user data to base64 to pass safely in URL
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`http://localhost:3000/auth/callback?data=${userData}`);
  }
}
