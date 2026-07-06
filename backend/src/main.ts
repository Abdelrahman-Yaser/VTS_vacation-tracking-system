import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('VTS_vacation-tracking-system')
    .setDescription('API for managing employees')
    .setVersion('1.0')
    .addBearerAuth() // لو عندك JWT
    .build();
  app.enableCors({
    // تأكد إن العنوان ده مطابق تماماً للي في المتصفح (بدون / في الآخر)
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    // إضافة كل الهيدرز اللي المتصفح بيحاول يبعتها
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
    ],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8900);
}
void bootstrap();
