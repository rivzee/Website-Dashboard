import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function bootstrap() {
  const envPath = path.resolve(__dirname, '..', '.env');
  console.log('Loading .env from:', envPath);
  dotenv.config({ path: envPath });

  // Fallback: Try loading from current directory
  if (!process.env.GOOGLE_CLIENT_ID) {
    const localEnvPath = path.resolve(process.cwd(), '.env');
    console.log('Retrying .env from:', localEnvPath);
    dotenv.config({ path: localEnvPath });
  }

  // Fallback 2: Try loading from parent directory
  if (!process.env.GOOGLE_CLIENT_ID) {
    const parentEnvPath = path.resolve(process.cwd(), '..', '.env');
    console.log('Retrying .env from parent:', parentEnvPath);
    dotenv.config({ path: parentEnvPath });
  }

  // DEBUG: Jika masih gagal, uncomment baris di bawah ini dan masukkan ID manual untuk tes
  // process.env.GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID';
  // process.env.GOOGLE_CLIENT_SECRET = 'YOUR_ACTUAL_CLIENT_SECRET';

  const app = await NestFactory.create(AppModule);

  // IZINKAN FRONTEND AKSES BACKEND (PENTING!)
  app.enableCors();

  console.log('------------------------------------------------');
  console.log('DEBUG: Checking Environment Variables...');
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (googleClientId) {
    console.log('✅ GOOGLE_CLIENT_ID is loaded:', googleClientId.substring(0, 10) + '...');
  } else {
    console.log('❌ GOOGLE_CLIENT_ID is MISSING or UNDEFINED');
    console.log('   Please check your backend/.env file.');
  }
  console.log('------------------------------------------------');

  await app.listen(process.env.PORT || 3001);
}
void bootstrap();
