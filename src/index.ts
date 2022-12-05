//以下のpose-detection/demos/live_video/からの抜粋コードが含まれます
//https://github.com/tensorflow/tfjs-models

import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';
import * as posedetection from '@tensorflow-models/pose-detection';
import { MoveNetModelConfig } from '@tensorflow-models/pose-detection';
import { Camera, MODELS } from './camera';
import * as params from './params';


class App {
    model:posedetection.SupportedModels;
    camera?: Camera;
    detector?: posedetection.PoseDetector;

    constructor() {
        this.model = posedetection.SupportedModels.MoveNet;
    }

    async build() {
        //cameraParam: { targetFPS: number, sizeOption: { width: number, height: number } }) {
        this.camera = await Camera.setupCamera(
            this.model,
            { targetFPS: 30, sizeOption: { width: 640, height: 480 } }
            );

        try {
            this.detector = await this.createDetector();
            console.log(tf.getBackend());

        }catch(err) {
            console.log(err);
        }

    }

    async createDetector() : Promise<posedetection.PoseDetector> {
        let modelTypeName = 'thunder';
        let customModel = '';

        let modelType = "";
        if (modelTypeName == 'lightning') {
          modelType = posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
        } else if (modelTypeName == 'thunder') {
          modelType = posedetection.movenet.modelType.SINGLEPOSE_THUNDER;
        } else if (modelTypeName == 'multipose') {
          modelType = posedetection.movenet.modelType.MULTIPOSE_LIGHTNING;
        }

        let modelConfig : MoveNetModelConfig = {modelType:modelType};
  
        if (customModel !== '') {
          modelConfig.modelUrl = customModel;
        }
        if (modelTypeName === 'multipose') {
          modelConfig.enableTracking = params.modelConfig.enableTracking;
        }
        return posedetection.createDetector(this.model, modelConfig);
    }

    async renderResult() {
        //this.cameraとthis.detectorは確実にnullではない（ようにプログラマはコーディングしている）
        const camera = this.camera!;
        const detector = this.detector!;

        if (camera.video.readyState < 2) {
            await new Promise((resolve) => {
                camera.video.onloadeddata = () => {
                    resolve(camera.video);
                };
            });
        }

        let poses = undefined;

        // Detectors can throw errors, for example when using custom URLs that
        // contain a model that doesn't provide the expected output.
        try {
            poses = await detector.estimatePoses(
                camera.video,
                { maxPoses: params.modelConfig.maxPoses, flipHorizontal: false });
        } catch (error) {
            detector.dispose();
            this.detector = undefined;
            alert(error);
        }


        if (poses && poses.length > 0 ) {
            camera.drawResults(poses);
        }
    }

    async renderPrediction() {
        this.camera!.drawCtx();
        await this.renderResult();
    }

    async run() {
        this.renderPrediction();

        //本メソッドをループ実行する(抜けたあと，再度呼び出される)
        requestAnimationFrame(this.run.bind(this));
    }
};

async function run() {
    const app = new App();
    await app.build();
    await app.run();
}

run();
