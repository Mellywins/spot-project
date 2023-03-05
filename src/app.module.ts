import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgres",
      port: 5432,
      password: "secret",
      username: "rootUser",
      database: "spot",
      synchronize: true,
      autoLoadEntities: true,
      entities: ["dist/**/*.entity{.ts,.js}"],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
