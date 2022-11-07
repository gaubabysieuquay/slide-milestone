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
  max = 100;
  min = 0;
  form: FormGroup;
  minValue = 1;
  maxValue = 2433;
  value = 1;
  displayValue = 0;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.max = this.getMaxPosition(this.maxValue);
    console.log({ max_nha: this.getMaxPosition(2433) });
  }

  initForm = () => {
    this.form = this.fb.group({
      distance: [this.min],
    });
  };

  getKMInMap(position: number, max = 0, maxKM = 0) {
    let km = 0;
    if (position <= 100) {
      km = position * 0.1;
    } else if (position > 100 && position <= 190) {
      km = position - 100 + 10;
    } else {
      km = (position - 190) * 100 + 100;
      if (position >= max) {
        km = maxKM;
      }
    }
    return km;
  }

  // value = km
  getMaxPosition(value: number) {
    let p = 0;
    if (!value) return this.max;
    // First 10 steps
    value -= 10;
    p = 100; // for 10 steps
    if (value <= 90) {
      p += value;
      console.log(
        '🚀 ~ file: app.component.ts ~ line 68 ~ AppComponent ~ getMaxPosition ~ p',
        p
      );
      return p;
    }
    // Next 90 steps
    value -= 90;
    p += 90;
    if (value <= 100) {
      p += 1;
      console.log(
        '🚀 ~ file: app.component.ts ~ line 76 ~ AppComponent ~ getMaxPosition ~ p',
        p
      );
      return p;
    }
    const roundValue = Math.ceil(value / 100);
    const isRedundant = roundValue * 100 - value;
    console.log(
      '🚀 ~ file: app.component.ts ~ line 87 ~ AppComponent ~ getMaxPosition ~ isRedundant',
      isRedundant
    );
    if (isRedundant > 0) {
      p += roundValue - 1;
      console.log(
        '🚀 ~ file: app.component.ts ~ line 83 ~ AppComponent ~ getMaxPosition ~ p',
        p
      );
    } else {
      p += roundValue;
      console.log(
        '🚀 ~ file: app.component.ts ~ line 86 ~ AppComponent ~ getMaxPosition ~ p',
        p
      );
    }
    return p;
  }

  getMaxPosition1(value: number) {
    let p = 0;
    const milestone = [10, 100];
    if (!value) return this.max;

    milestone.map((item) => {
      value -= item;
    });
    // First 10 steps
    value -= 10;
    p = 100; // for 10 steps
    if (value <= 90) {
      p += value;
      return p;
    }
    // Next 90 steps
    value -= 90;
    p += 90;
    if (value <= 100) {
      p += 1;
      return p;
    }
    const roundValue = Math.ceil(value / 100);
    const isRedundant = roundValue * 100 - value;
    if (isRedundant > 0) {
      p += roundValue - 1;
    } else {
      p += roundValue;
    }
    return p;
  }

  onHandleChange = (event: any) => {
    const km = this.getKMInMap(this.form.get('distance')?.value);
    this.displayValue = this.getKMInMap(
      this.form.get('distance')?.value,
      this.max,
      this.maxValue
    );
    console.log({ km, position: this.form.get('distance')?.value });
  };
}
