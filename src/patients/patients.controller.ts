import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.patientsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Patient>) {
    return this.patientsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Patient>) {
    return this.patientsService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.patientsService.delete(+id);
  }
}

