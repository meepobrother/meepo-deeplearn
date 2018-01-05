import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Array1D, NDArrayMathGPU, Scalar } from 'deeplearn';

@Component({
    selector: 'dp-add',
    templateUrl: 'dp-add.html'
})

export class DpAddComponent implements OnInit {
    a: number;
    b: number;
    result: any;
    constructor(
        public cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const math = new NDArrayMathGPU();

        console.log();
    }

    async add() {
        const math = new NDArrayMathGPU();
        const a = Scalar.new(+this.a);
        const b = Scalar.new(+this.b);
        const result = await math.add(a, b).data();
        this.result = result;
        this.cd.markForCheck();
    }
}