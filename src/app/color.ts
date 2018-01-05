import {
    Array1D, CostReduction, ENV, FeedEntry, Graph,
    InCPUMemoryShuffledInputProviderBuilder,
    NDArrayMath, Session, SGDOptimizer, Tensor
} from 'deeplearn';

class ComplementaryColorModel {
    session: Session;
    math = ENV.math;
    initialLearningRate = 0.042;
    optimizer: SGDOptimizer;
    batchSize = 300;
    inputTensor: Tensor;
    targetTensor: Tensor;
    costTensor: Tensor;
    predictionTensor: Tensor;
    feedEntries: FeedEntry[];
    constructor() {
        this.optimizer = new SGDOptimizer(this.initialLearningRate);
    }
    setupSession(): void {
        const graph = new Graph();
        this.inputTensor = graph.placeholder('input RGB value', [3]);
        this.targetTensor = graph.placeholder('output RGB value', [3]);
        let fullyConnectedLayer =
            this.createFullyConnectedLayer(graph, this.inputTensor, 0, 64);
        fullyConnectedLayer =
            this.createFullyConnectedLayer(graph, fullyConnectedLayer, 1, 32);
        fullyConnectedLayer =
            this.createFullyConnectedLayer(graph, fullyConnectedLayer, 2, 16);
        this.predictionTensor =
            this.createFullyConnectedLayer(graph, fullyConnectedLayer, 3, 3);
        this.costTensor =
            graph.meanSquaredCost(this.targetTensor, this.predictionTensor);
        this.session = new Session(graph, this.math);
        this.generateTrainingData(1e4);
    }
    train1Batch(shouldFetchCost: boolean): number {
        const learningRate =
            this.initialLearningRate * Math.pow(0.85, Math.floor(step / 42));
        this.optimizer.setLearningRate(learningRate);
        let costValue = -1;
        this.math.scope(() => {
            const cost = this.session.train(
                this.costTensor, this.feedEntries, this.batchSize, this.optimizer,
                shouldFetchCost ? CostReduction.MEAN : CostReduction.NONE);
            if (!shouldFetchCost) {
                return;
            }
            costValue = cost.get();
        });
        return costValue;
    }
    normalizeColor(rgbColor: number[]): number[] {
        return rgbColor.map(v => v / 255);
    }
    denormalizeColor(normalizedRgbColor: number[]): number[] {
        return normalizedRgbColor.map(v => v * 255);
    }
    predict(rgbColor: number[]): number[] {
        let complementColor: number[] = [];
        this.math.scope((keep, track) => {
            const mapping = [{
                tensor: this.inputTensor,
                data: Array1D.new(this.normalizeColor(rgbColor)),
            }];
            const evalOutput = this.session.eval(this.predictionTensor, mapping);
            const values = evalOutput.dataSync();
            const colors = this.denormalizeColor(Array.prototype.slice.call(values));
            complementColor =
                colors.map(v => Math.round(Math.max(Math.min(v, 255), 0)));
        });
        return complementColor;
    }
    private createFullyConnectedLayer(
        graph: Graph, inputLayer: Tensor, layerIndex: number,
        sizeOfThisLayer: number) {
        return graph.layers.dense(
            `fully_connected_${layerIndex}`, inputLayer, sizeOfThisLayer,
            (x) => graph.relu(x));
    }
    private generateTrainingData(exampleCount: number) {
        const rawInputs = new Array(exampleCount);
        const oldMath = ENV.math;
        const safeMode = false;
        const math = new NDArrayMath('webgl', safeMode);
        ENV.setMath(math);
        for (let i = 0; i < exampleCount; i++) {
            rawInputs[i] = [
                this.generateRandomChannelValue(),
                this.generateRandomChannelValue(),
                this.generateRandomChannelValue()
            ];
        }
        const inputArray: Array1D[] =
            rawInputs.map(c => Array1D.new(this.normalizeColor(c)));
        const targetArray: Array1D[] = rawInputs.map(
            c => Array1D.new(
                this.normalizeColor(this.computeComplementaryColor(c))));
        const shuffledInputProviderBuilder =
            new InCPUMemoryShuffledInputProviderBuilder([inputArray, targetArray]);
        const [inputProvider, targetProvider] =
            shuffledInputProviderBuilder.getInputProviders();
        this.feedEntries = [
            { tensor: this.inputTensor, data: inputProvider },
            { tensor: this.targetTensor, data: targetProvider }
        ];
        ENV.setMath(oldMath);
    }
    private generateRandomChannelValue() {
        return Math.floor(Math.random() * 256);
    }
    computeComplementaryColor(rgbColor: number[]): number[] {
        let r = rgbColor[0];
        let g = rgbColor[1];
        let b = rgbColor[2];
        r /= 255.0;
        g /= 255.0;
        b /= 255.0;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = (max + min) / 2.0;
        let s = h;
        const l = h;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));
            if (max === r && g >= b) {
                h = 1.0472 * (g - b) / d;
            } else if (max === r && g < b) {
                h = 1.0472 * (g - b) / d + 6.2832;
            } else if (max === g) {
                h = 1.0472 * (b - r) / d + 2.0944;
            } else if (max === b) {
                h = 1.0472 * (r - g) / d + 4.1888;
            }
        }
        h = h / 6.2832 * 360.0 + 0;
        h += 180;
        if (h > 360) {
            h -= 360;
        }
        h /= 360;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [r, g, b].map(v => Math.round(v * 255));
    }
}

let step = 0;
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ColorService {

    complementaryColorModel: ComplementaryColorModel;
    colors: any[] = [];
    training$: Subject<any> = new Subject();

    constructor() {
        this.complementaryColorModel = new ComplementaryColorModel();
        this.complementaryColorModel.setupSession();
    }

    setColors(colors: any[]) {
        this.colors = colors;
    }

    trainAndMaybeRender() {
        if (step > 4242) {
            return;
        }
        requestAnimationFrame(() => {
            this.trainAndMaybeRender();
        });
        const localStepsToRun = 10;
        let cost;
        for (let i = 0; i < localStepsToRun; i++) {
            cost = this.complementaryColorModel.train1Batch(i === localStepsToRun - 1);
            step++;
        }
        console.log('step', step - 1, 'cost', cost);
        this.colors.map(color => {
            const originalColor = color.color.split(',').map(v => parseInt(v, 10));
            const predictedColor = this.complementaryColorModel.predict(originalColor);
            color.predictedColor = `rgb(${predictedColor[0]},${predictedColor[1]},${predictedColor[2]})`;
        });
        this.training$.next(this.colors);
        console.log(this.complementaryColorModel);
    }

}