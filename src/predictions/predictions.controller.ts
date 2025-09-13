import { Controller, Get, Param, Delete, Body, Patch} from '@nestjs/common';
import { PredictionsService } from './predictions.service';

@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const prediction = await this.predictionsService.findById(id);
    return prediction;
  }
  @Get('user/:id')
  findByUser(@Param('id') id: number) {
    return this.predictionsService.findByUser(+id); // predicciones solo del médico con ID dado
  }
  @Get('patient/:id')
  findByPatient(@Param('id') id: number) {
    return this.predictionsService.findByPatient(+id);// predicciones solo del paciente con ID dado
  }  
  @Get('user/:userId/patient/:patientId')
  findByUserAndPatient(
  @Param('userId') userId: number,
  @Param('patientId') patientId: number,) {
    return this.predictionsService.findByUserAndPatient(+userId, +patientId);// predicciones solo del paciente y usuario con ID dado
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.predictionsService.delete(+id);
  }
  @Patch(':id/validate')
  validate(
    @Param('id') id: number,
    @Body() body: { comment?: string },
  ) {
    return this.predictionsService.validatePrediction(+id, body.comment);
  }
  @Get('pending/count')
  async getPendingCount() {
    const count = await this.predictionsService.getPendingCount();
    return { pendingCount: count };
}
}