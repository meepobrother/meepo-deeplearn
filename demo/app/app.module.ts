import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DeepLearnModule } from '../../src/app/app';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DeepLearnModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

