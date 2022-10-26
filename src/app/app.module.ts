import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { SliderMilestoneDirective } from './shared/slider-milestone-directive/slider-milestone.directive';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SliderModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [AppComponent, SliderMilestoneDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
