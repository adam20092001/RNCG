import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import { join } from 'path';
import { PredictionsService } from 'src/predictions/predictions.service';
import { PatientsService } from 'src/patients/patients.service';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';

@Injectable()
export class PredictService implements OnModuleInit {
  private model: tf.LayersModel;

  constructor(
    private readonly predictionsService: PredictionsService,
    private readonly usersService: UsersService,
    private readonly patientsService: PatientsService,
  ) {}

  async onModuleInit() {
    const modelPath = `file://${join(__dirname, '../../modelo/model.json')}`;
    this.model = await tf.loadLayersModel(modelPath);
    console.log('Modelo cargado correctamente');
  }

  // Método mejorado: predice y guarda
  async predictAndSave(imageKey: string, userId: number, patientId: number) {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    const imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${imageKey}`;

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    //const buffer = await readFile(fullImagePath); // lee el archivo físico
    const imageTensor = tf.node
      .decodeImage(buffer, 3)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));
  
    const prediction = this.model.predict(imageTensor) as tf.Tensor;
    const predictionArray = await prediction.array();
  
    const result = predictionArray[0];
    const labels = ['EGC', 'LESIONES BENIGNAS', 'NORMAL'];
    const resultIndex = result.indexOf(Math.max(...result));
    const resultLabel = labels[resultIndex];
    const score = result[resultIndex];
  
    const probabilities = {
      EGC: result[0],
      'LESIONES BENIGNAS': result[1],
      NORMAL: result[2],
    };
    const predictionsave = await this.predictionsService.create({
      result: resultLabel,
      score,
      image: imageUrl,
      probabilities,
      userId,
      patientId,
    });
    return {
      message: '✅ Predicción completada correctamente',
      predictionId: predictionsave.id, //clave para redirigir luego
    };
  }
  
}
