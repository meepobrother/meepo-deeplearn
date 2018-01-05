// 神经网络最小单元
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/combineLatest';
import {
    Array1D,
    Array2D,
    Array3D,
    Array4D,
    DataStats,
    XhrDataset,
    XhrDatasetConfig,
    XhrModelConfig,
    Features,
    FeedEntry,
    CheckpointLoader,
    CostReduction,
    InputProvider,
    LSTMCell,
    MetricReduction,
    Model,
    MomentumOptimizer,
    RMSPropOptimizer,
    Session,
    NDArray,
    NDArrayMath,
    NDArrayMathCPU,
    NDArrayMathGPU,
    Scalar,
    Tensor,
    InMemoryDataset,
    // math
    MathBackendCPU,
    MathBackendWebGL,
    MatrixOrientation,
    // 优化器
    Optimizer,
    AdadeltaOptimizer,
    AdagradOptimizer,
    AdamaxOptimizer,
    AdamOptimizer,
    SGDOptimizer,
    // 图形
    Graph,
    GraphRunner,
    GPGPUContext,
    GraphRunnerEventObserver,
    // 初始化
    Initializer,
    OnesInitializer,
    ZerosInitializer,
    NDArrayInitializer,
    ConstantInitializer,
    RandomNormalInitializer,
    RandomUniformInitializer,
    VarianceScalingInitializer,
    RandomTruncatedNormalInitializer,
    // builder
    InCPUMemoryShuffledInputProviderBuilder,
    InGPUMemoryShuffledInputProviderBuilder,
} from 'deeplearn';

@Injectable()
export class MeCoreService {
    // 计算结果输出
    MeOutput: Subject<any> = new Subject();
    // 学习到的参数
    MeOption: Subject<any> = new Subject();
    // 检查器
    MeCheck: Subject<MeResult> = new Subject();
    // 一系列的输入及结果 必须可逆 也可以根据结果拿到输入
    MeInput: Subject<any> = new Subject();
    MeResult: Subject<any> = new Subject();
    constructor() {
        this.MeCheck.subscribe((res: MeResult) => {
            if (res === 0) {
                // 错误
            } else {
                // 正确
            }
        });
        this.MeOutput.subscribe((res: any) => {
            this._output(res);
        });
        this.MeInput.asObservable().combineLatest(this.MeResult.asObservable()).subscribe(res => {
            this._do(res[0], res[1]);
        });
    }

    _do(res, dest) {
        // 通过算法 计算
        console.log(res, dest);
    }

    _output(res) {
        console.log(res);
    }

    setInput(val: any) {
        this.MeInput.next(val);
    }

    setResult(val: any) {
        this.MeResult.next(val);
    }

}
// 0错误 1正确
export type MeResult = 0 | 1;


