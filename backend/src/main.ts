import dns from 'node:dns';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

// Ensure SRV DNS records resolve reliably across all operating systems & ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setting DNS is restricted
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse HTTP-only cookies
  app.use(cookieParser());

  // Strict DTO request payload validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure CORS for cross-domain cookie exchange (Vercel <-> Render & Localhost)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
  }

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else if (origin.endsWith('.vercel.app')) {
        // Automatically permit preview and production Vercel deployments
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 Backend server running on: http://localhost:${port}`);
}
await bootstrap();
