import dns from 'node:dns';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Ensure SRV DNS records resolve reliably across all operating systems & ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setting DNS is restricted
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 Backend server running on: http://localhost:${port}`);
}
await bootstrap();
