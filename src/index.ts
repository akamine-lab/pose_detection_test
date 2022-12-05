//以下のpose-detection/demos/live_video/からの抜粋コードが含まれます
//https://github.com/tensorflow/tfjs-models

import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';
import * as posedetection from '@tensorflow-models/pose-detection';
import { Pose, Keypoint, MoveNetModelConfig } from '@tensorflow-models/pose-detection';
import { Camera } from './camera';
import * as params from './params';

class App {
    camera?: Camera;
    detector?: posedetection.PoseDetector;

    constructor() {
    }

    async build() {
        //cameraParam: { targetFPS: number, sizeOption: { width: number, height: number } }) {
        this.camera = await Camera.setupCamera(
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
        const modelName = params.detection_model;
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
        return posedetection.createDetector(modelName, modelConfig);
    }

    async detect() : Promise<Pose[]>  {
        //this.cameraとthis.detectorは確実にnullではない（ようにプログラマはコーディングしている）
        const camera = this.camera!;
        const detector = this.detector!;

        let poses = Array<Pose>();

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

        return poses;
    }

    async run() {
        //this.cameraとthis.detectorは確実にnullではない（ようにプログラマはコーディングしている）
        const camera = this.camera!;

        await camera.waitReady();
        camera.drawVideo();

        const poses = await this.detect();
        if (poses.length > 0 ) {
            camera.drawResults(poses);
        }

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
