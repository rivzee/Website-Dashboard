import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        console.log('--- GoogleStrategy Initialized ---');
        console.log('ClientID from ConfigService:', clientID ? clientID.substring(0, 10) + '...' : 'UNDEFINED');

        super({
            clientID: clientID || 'YOUR_CLIENT_ID', // GANTI 'YOUR_CLIENT_ID' DENGAN ID ASLI JIKA ENV GAGAL
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'YOUR_CLIENT_SECRET',
            callbackURL: 'http://localhost:3001/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
}
