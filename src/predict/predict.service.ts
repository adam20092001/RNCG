import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import { join } from 'path';

@Injectable()
export class PredictService implements OnModuleInit {
  private model: tf.LayersModel;

  async onModuleInit() {
    const modelPath = `file://${join(__dirname, '../../modelo/model.json')}`;
    this.model = await tf.loadLayersModel(modelPath);
    console.log('Modelo cargado correctamente');
  }

  async predictImageBuffer(buffer: Buffer): Promise<string> {
    const modelPath = `file://${join(__dirname, '../../modelo/model.json')}`;
    this.model = await tf.loadLayersModel(modelPath);
    console.log('Modelo cargado correctamente');

    const imageTensor = tf.node
      .decodeImage(buffer, 3)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));

    const prediction = this.model.predict(imageTensor) as tf.Tensor;
    const predictionArray = await prediction.array();

    const resultIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
    const labels = ['EGC', 'LESIONES BENIGNAS', 'NORMAL'];

    return labels[resultIndex];
  }
}
