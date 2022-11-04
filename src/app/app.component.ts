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
  minValue = 0;
  maxValue = 2500;
  value = 1;
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
    let currPos = data.position;
    let nextPos = 0;

    switch (true) {
      case data.value >= 0 && data.value < 10:
        nextPos = this.getPositionFromValue(data, data.value + 0.1);
        break;
      case data.value > 10 && data.value < 100:
        nextPos = this.getPositionFromValue(data, data.value + 1);
        break;
      case data.value > 100:
        nextPos = this.getPositionFromValue(data, data.value + 100);
        break;
      default:
        return 1;
    }

    // console.log(
    //   '🚀 ~ file: app.component.ts ~ line 36 ~ AppComponent ~ currPos',
    //   currPos
    // );
    // console.log(
    //   '🚀 ~ file: app.component.ts ~ line 38 ~ AppComponent ~ nextPos',
    //   nextPos
    // );
    return nextPos - currPos;
  };

  changeValue = (event: any) => {
    const data = this.getValues();
    this.setPositionValue(event.value, data);
  };

  setPositionValue(position: any, data: any) {
    this.value = this.getValueFromPosition(position, data);
    console.log(
      '🚀 ~ file: app.component.ts ~ line 76 ~ AppComponent ~ setPositionValue ~ this.getValueFromPosition(position, data)',
      this.getValueFromPosition(position, data)
    );

    switch (true) {
      case this.value < 10:
        this.value = this.roundNumber(
          this.getValueFromPosition(position, data),
          8
        );
        break;
      case this.roundNumber(this.value) === this.max:
        this.value = this.roundNumber(
          this.getValueFromPosition(position, data),
          0
        );
        break;
      default:
        this.value = this.roundNumber(
          this.getValueFromPosition(position, data),
          2
        );
        break;
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

  roundNumber = (num: number, decimal = 1): number => {
    const decimalNum = Math.pow(10, decimal);

    return +(
      Math.round((num + Number.EPSILON) * decimalNum) / decimalNum
    ).toFixed(decimal);
  };

  // roundNumber = (num: number, roundType = 'round', decimal = 1) => {
  //   const decimalNum = Math.pow(10, decimal);

  //   switch (roundType) {
  //     case 'ceil':
  //       return Math.ceil((num + Number.EPSILON) * decimalNum) / decimalNum;
  //     case 'floor':
  //       return Math.floor((num + Number.EPSILON) * decimalNum) / decimalNum;
  //     default:
  //       return Math.round((num + Number.EPSILON) * decimalNum) / decimalNum;
  //   }
  // };
}
