import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Slider } from 'primeng/slider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('slider', { static: false }) slider: Slider;
  sliderEl: ElementRef;
  max: number = 2500;
  min: number = 0;
  form: FormGroup;
  displayValue: string | number;

  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    this.initForm();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.sliderEl = this.slider.el.nativeElement;
  }

  initForm = () => {
    this.form = this.fb.group({
      distance: [0, Validators.min(0)],
    });
  };

  stepIncrement = () => {
    const step = this.changeValueDisplay();
    console.log(
      '🚀 ~ file: app.component.ts ~ line 44 ~ AppComponent ~ step',
      step
    );
    switch (true) {
      case step >= 0 && step < 10:
        return 0.1;
      case step >= 10 && step < 100:
        return 1;
      default:
        return 100;
    }
  };

  changeValueDisplay = () => {
    return this.form.get('distance')!.value + 10;
  };
}
