import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquipoModule } from './equipo/equipo.module';
import { EquipoController } from './equipo/equipo.controller';
import { EquipoService } from './equipo/equipo.service';

@Module({
  imports: [EquipoModule],
  controllers: [AppController,EquipoController],
  providers: [AppService,EquipoService],
})
export class AppModule {}
