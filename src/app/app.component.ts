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
export class AppComponent {
  max: number = 2500;
  min: number = 1;
  form: FormGroup;
  displayValue: string | number;
  minValue: number = 0;
  maxValue: number = 2500;
  value: number = 0;
  scale: any = 0;
  position = 0;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  initForm = () => {
    this.form = this.fb.group({
      distance: [0, Validators.min(0)],
    });
  };

  stepIncrement = () => {
    let data = this.getValues(true);
    let val = 0;
    let calStep = this.roundNumber(this.getValueFromPosition(data.value, data));

    switch (true) {
      case calStep >= 0 && calStep < 10:
        val = calStep + 0.1;
        break;
      case calStep >= 10 && calStep <= 100:
        calStep = this.roundNumber(
          this.getValueFromPosition(data.value, data),
          0
        );
        val = calStep + 1;
        break;
      default:
        val = calStep + 100;
        break;
    }

    const prevStep = this.roundNumber(
      this.getPositionFromValue(data, calStep),
      6
    );
    const nextStep = this.roundNumber(this.getPositionFromValue(data, val), 6);

    return nextStep - prevStep;
  };

  changeValue = (event: any) => {
    let data = this.getValues();
    this.setPositionValue(event.value, data);
  };

  setPositionValue(position: any, data: any) {
    this.value = this.roundNumber(this.getValueFromPosition(position, data));
    this.form.controls['distance'].setValue(position);
  }

  getValues(step = false) {
    if (!step) {
      this.value = this.form.controls['distance'].value
        ? this.form.controls['distance'].value
        : this.value;
    }

    let data = {
      min: Math.log(this.min),
      max: Math.log(this.max),
      scale: +this.scale,
      value: step ? this.form.controls['distance'].value : +this.value,
      position: this.position,
      minValue: this.minValue,
      maxValue: this.maxValue,
    };

    data['scale'] = (data.max - data.min) / (data.maxValue - data.minValue);
    if (data.value) {
      data['position'] = this.getPositionFromValue(data);
    }
    return data;
  }

  // Calculate slider value from a position
  getValueFromPosition(position: any, data: any) {
    return Math.exp((position - data.minValue) * data.scale + data.min);
  }

  // Calculate slider position from a value
  getPositionFromValue(data: any, step: number = 0) {
    return (
      data.minValue +
      (Math.log(step ? step : data.value) - data.min) / data.scale
    );
  }

  roundNumber = (num: number, decimal = 1) => {
    let decimalNum = Math.pow(10, decimal);
    return Math.round((num + Number.EPSILON) * decimalNum) / decimalNum;
  };
}
