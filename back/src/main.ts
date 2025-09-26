import { NestFactory } from "@nestjs/core";
import { AppModule } from "./serverModule";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Получаем настройки CORS из .env
  const corsOrigin = configService.get<string>("CORS_ORIGIN") || "*";
  const corsCredentials =
    configService.get<boolean>("CORS_CREDENTIALS") || false;

  app.enableCors({
    origin: corsOrigin,
    credentials: corsCredentials,
  });

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}
bootstrap();
