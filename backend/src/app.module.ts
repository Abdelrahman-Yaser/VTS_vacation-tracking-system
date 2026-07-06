import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SystemAdministratorModule } from './modules/system-administrator/system-administrator.module';
import { VacationRequestModule } from './modules/vacation-request/vacation-request.module';
import { ManagerModule } from './modules/manager/manager.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { Employee } from './modules/employee/entities/employee.entity';
import { Hr } from './modules/hr/entities/hr.entity';
import { Manager } from './modules/manager/entities/manager.entity';
import { VacationRequest } from './modules/vacation-request/entities/vacation-request.entity';
import { systemRdministrator } from './modules/system-administrator/entities/system-administrator.entity';
import { HrModule } from './modules/hr/hr.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { TeamsModule } from './modules/teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST') as string,
        port: Number(config.get('POSTGRES_PORT')) || 5432,
        username: config.get('POSTGRES_USER') as string,
        password: config.get('POSTGRES_PASSWORD') as string,
        database: config.get('POSTGRES_DB') as string,
        entities: [Employee, Manager, Hr, VacationRequest, systemRdministrator],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    EventEmitterModule.forRoot(),
    EmployeeModule,
    ManagerModule,
    HrModule,
    SystemAdministratorModule,
    VacationRequestModule,
    AuthModule,
    DepartmentsModule,
    TeamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
