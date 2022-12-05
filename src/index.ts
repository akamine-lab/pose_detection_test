//以下のpose-detection/demos/live_video/からの抜粋コードが含まれます
//https://github.com/tensorflow/tfjs-models

import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';
import * as posedetection from '@tensorflow-models/pose-detection';
import { Pose, Keypoint, MoveNetModelConfig } from '@tensorflow-models/pose-detection';
import { Camera } from './camera';
import { Detector } from './detector';
import * as params from './params';

class App {
    camera?: Camera;
    detector?: Detector;

    constructor() {
    }

    async build() {
        //cameraParam: { targetFPS: number, sizeOption: { width: number, height: number } }) {
        this.camera = await Camera.setupCamera(
            { 
                targetFPS: 30, 
                sizeOption: { width: 640, height: 480 } }
            );

        this.detector = await Detector.create();

    }

    async run() {
        //this.cameraとthis.detectorは確実にnullではない（ようにプログラマはコーディングしている）
        const camera = this.camera!;
        const detector = this.detector!;

        await camera.waitReady();
        camera.drawVideo();

        const poses = await detector.detect(camera.video);
        if (poses.length > 0 ) {
            camera.drawResults(poses);

            //例えばここでposesを分析するクラスのメソッドを呼び出す
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
