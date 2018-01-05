import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeepLearnComponent } from './deeplearn/deep-learn';
import { FormsModule } from '@angular/forms';
import { DpAddComponent } from './dp-add/dp-add';
import { MeCoreService } from './core';
import { ColorService } from './color';

@NgModule({
    declarations: [
        DeepLearnComponent,
        DpAddComponent
    ],
    imports: [CommonModule, FormsModule],
    exports: [
        DeepLearnComponent,
        DpAddComponent
    ],
    providers: [
        MeCoreService,
        ColorService
    ],
})
export class DeepLearnModule { }
export { MeCoreService } from './core';
export { ColorService } from './color';


