import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MeCoreService, ColorService } from '../../src/app/app';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'app';

  colors: any[] = [
    '244,67,54',
    '233,30,99',
    '156,39,176',
    '103,58,183',
    '63,81,181',
    '33,150,243',
    '76,175,80',
    '139,195,74',
    '205,220,57',
    '255,235,59',
    '255,193,7',
    '255,152,0',
    '255,87,34',
    '121,85,72',
    '158,158,158',
    '96,125,139',
    '0,0,0'
  ];
  colorObjs = [];
  constructor(
    public core: MeCoreService,
    public color: ColorService,
    public cd: ChangeDetectorRef
  ) {
    this.color.training$.subscribe(res => {
      this.colorObjs = res;
      this.cd.markForCheck();
    });
  }
  ngOnInit() {
    // init
    this.initUi();
  }

  initUi() {
    this.colors.map(color => {
      let originalColor =
          color
          .split(',')
          .map(v => parseInt(v, 10));

      this.colorObjs.push({
        color: color,
        rgb: 'rgb(' + color + ')',
        complement: 'rgb(' + this.color.complementaryColorModel.computeComplementaryColor(originalColor) + ')'
      });
    });
    this.color.setColors(this.colorObjs);
    this.color.trainAndMaybeRender();
  }

  add() { }

  _input(e: any) {
    this.core.setInput(e.target.value);
  }
  _output(e: any) {
    this.core.setResult(e.target.value);
  }
}
