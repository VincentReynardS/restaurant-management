import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('PG_HOST'),
          port: 5432,
          username: configService.get<string>('PG_USERNAME'),
          password: configService.get<string>('PG_PASSWORD'),
          database: configService.get<string>('PG_DATABASE'),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: configService.get<boolean>('TYPEORM_SYNC'),
        };
      },
      inject: [ConfigService],
    }),
    IngredientsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.development', '.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production' ? true : false,
    }),
  ],
})
export class AppModule {}
