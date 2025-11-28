import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({    
    whitelist: true,            // elimina campos que no existen en el DTO
    forbidNonWhitelisted: true, // lanza error si mandan campos extra
    transform: true,            // convierte los tipos (string→number)
  }));

  // Habilitar CORS
  app.enableCors({    
    //origin: '*',
    origin: [
          
          "http://localhost:5173",                   // el puerto donde corre nuestro React
          "https://fit-turnos.web.app"          // URL de firebase, nuestro front end
          
          ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,

    //allowedHeaders: 'Content-Type, Authorization, Accept',

  });

  //await app.listen(process.env.PORT ?? 3000);
  await app.listen(process.env.PORT || 3000);
  //await app.listen(3000);
  console.log('🚀 Backend corriendo ');
}
bootstrap();

/* ValidationPipe
Es lo que le dice a NestJS: Validá los DTO con class-validator ANTES de que el request llegue al service.
  DTO SIN ValidationPipe → Decoradores NO funcionan
  DTO CON ValidationPipe → Decoradores validan automáticamente
*/
