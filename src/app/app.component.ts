import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  max = 2500;
  min = 1;
  form: FormGroup;
  minValue = 1;
  maxValue = 2500;
  value = 0;
  scale = 0;
  position = 1;
  displayValue: string | number;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  initForm = () => {
    this.form = this.fb.group({
      distance: [1, Validators.min(1)],
    });
  };

  stepIncrement = () => {
    const data = this.getValues();
    let currPos = 0;

    let nextPos = 0;

    switch (true) {
      case data.value < 10:
        return 1;
      case data.value < 100:
        currPos = this.roundNumber(data.position, 'ceil', 0);
        nextPos = this.roundNumber(
          this.getPositionFromValue(data, data.value + 1),
          'ceil',
          0
        );
        break;
      default:
        currPos = this.roundNumber(data.position, 'ceil', 0);
        nextPos = this.roundNumber(
          this.getPositionFromValue(data, data.value + 100),
          'ceil',
          0
        );
        break;
    }
    console.log(
      '🚀 ~ file: app.component.ts ~ line 36 ~ AppComponent ~ currPos',
      currPos
    );
    console.log(
      '🚀 ~ file: app.component.ts ~ line 38 ~ AppComponent ~ nextPos',
      nextPos
    );
    return nextPos - currPos;
  };

  changeValue = (event: any) => {
    const data = this.getValues();
    this.setPositionValue(event.value, data);
  };

  setPositionValue(position: any, data: any) {
    if (this.value < 10) {
      this.value = this.roundNumber(
        this.getValueFromPosition(position, data),
        'floor'
      );
    } else {
      this.value = this.roundNumber(
        this.getValueFromPosition(position, data),
        'floor',
        0
      );
    }
    // this.form.controls['distance'].setValue(position);
  }

  getValues() {
    const data = {
      min: Math.log(this.min),
      max: Math.log(this.max),
      scale: +this.scale,
      value: +this.value,
      position: this.position,
      minValue: this.minValue,
      maxValue: this.maxValue,
    };
    console.log(
      '🚀 ~ file: app.component.ts ~ line 73 ~ AppComponent ~ getValues ~ data',
      data
    );

    data['scale'] = (data.max - data.min) / (data.maxValue - data.minValue);
    if (data.value) {
      data['position'] =
        data.value > 10
          ? this.roundNumber(this.getPositionFromValue(data), 'ceil', 0)
          : this.getPositionFromValue(data);
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

  roundNumber = (num: number, roundType = 'round', decimal = 1) => {
    const decimalNum = Math.pow(10, decimal);

    switch (roundType) {
      case 'ceil':
        return Math.ceil(num * decimalNum) / decimalNum;
      case 'floor':
        return Math.floor(num * decimalNum) / decimalNum;
      default:
        return Math.round((num + Number.EPSILON) * decimalNum) / decimalNum;
    }
  };
}
