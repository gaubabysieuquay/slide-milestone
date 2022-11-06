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
  max = 100;
  min = 0;
  form: FormGroup;
  minValue = 1;
  maxValue = 2500;
  value = 1;
  scale = 0;
  position = 1;
  displayValue = 1;

  constructor(
    private fb: FormBuilder,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.initForm();
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.maxValue = this.maxValue + 1;
  }

  initForm = () => {
    this.form = this.fb.group({
      distance: [this.min],
    });
  };

  stepIncrement = () => {
    const data = this.getValues();
    let currPos = data.position;
    let nextPos = 0;

    switch (true) {
      case data.value >= 0 && data.value < 10:
        nextPos = this.getPositionFromValue(data, data.value + 0.1);
        break;
      case data.value >= 10 && data.value <= 100:
        nextPos = this.getPositionFromValue(data, data.value + 1);
        break;
      case data.value > 100:
        nextPos = this.getPositionFromValue(data, data.value + 100);
        break;
      default:
        break;
    }

    return nextPos - currPos;
  };

  changeValue = (event: any) => {
    const data = this.getValues();
    this.setPositionValue(event.value, data);
  };

  setPositionValue(position: any, data: any) {
    if (this.roundNumber(this.value) === this.maxValue) {
      this.value = this.roundNumber(
        this.getValueFromPosition(position, data),
        0
      );
    } else {
      this.value = this.roundNumber(
        this.getValueFromPosition(position, data),
        2
      );
    }
    this.displayValue = this.value - 1;
    this.form.controls['distance'].setValue(position);
  }

  getValues() {
    const data = {
      min: this.min,
      max: this.max,
      scale: +this.scale,
      value: +this.value,
      position: this.position,
      minValue: Math.log(this.minValue),
      maxValue: Math.log(this.maxValue),
    };
    data['scale'] = (data.maxValue - data.minValue) / (data.max - data.min);
    if (data.value) {
      data['position'] = this.getPositionFromValue(data);
    }
    return data;
  }

  // Calculate slider value from a position
  getValueFromPosition(position: any, data: any) {
    return Math.exp((position - data.min) * data.scale + data.minValue);
  }

  // Calculate slider position from a value
  getPositionFromValue(data: any, step: number = 0) {
    return (
      data.min +
      (Math.log(step ? step : data.value) - data.minValue) / data.scale
    );
  }

  roundNumber = (num: number, decimal = 1): number => {
    const decimalNum = Math.pow(10, decimal);
    return +(
      Math.round((num + Number.EPSILON) * decimalNum) / decimalNum
    ).toFixed(decimal);
  };
}
