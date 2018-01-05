import { Component, OnInit } from '@angular/core';
import { Array1D, NDArrayMathGPU, Scalar } from 'deeplearn';

@Component({
    selector: 'deep-learn',
    templateUrl: 'deep-learn.html'
})

export class DeepLearnComponent implements OnInit {
    constructor() { }

    ngOnInit() {
        const math = new NDArrayMathGPU();
        const a = Array1D.new([1, 2, 3]);
        const b = Scalar.new(2);
        const result = math.add(a, b);
        // console.log(await result.data());
        result.data().then(data => console.log(data));
        console.log(result.dataSync());
    }
}