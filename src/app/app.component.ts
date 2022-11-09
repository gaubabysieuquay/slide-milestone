import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  // minValue = 1;
  maxValue = 2443.2;
  displayValue = 0;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.max = this.getMaxPosition(this.maxValue);
  }

  initForm = () => {
    this.form = this.fb.group({
      distance: [this.min],
    });
  };

  getDisplayValue(position: number, max = 0, maxValue = 0) {
    let value = 0;
    let temp_pos = position;
    if (temp_pos <= 100) {
      value = temp_pos * 0.1;
    } else if (temp_pos > 100 && temp_pos <= 190) {
      value = temp_pos - 100 + 10;
    } else {
      temp_pos -= 190;
      value = (temp_pos / 10) * 100 + 100;
      if (position >= max) {
        value = maxValue;
      }
    }
    return value;
  }

  // value = km
  getMaxPosition(value: number) {
    let position = 0;
    if (!value) {
      return position;
    }
    // qui đổi 10KM đầu tiên
    value -= 10;
    position = 100; // for 10km
    if (value <= 90) {
      position += value;
      return position;
    }
    // qui đổi 90KM tiếp theo
    value -= 90;
    position += 90;
    if (value <= 100) {
      position += 1;
      return position;
    }
    let roundNumber = Math.ceil(value / 100);
    const isRedundant = roundNumber * 100 - value;
    if (isRedundant > 0) {
      roundNumber -= 1;
    }

    roundNumber = roundNumber * 10; // tang 10 rn moi step

    position += roundNumber;
    return position;
  }

  onHandleChange = () => {
    this.displayValue = this.getDisplayValue(
      this.form.get('distance')?.value,
      this.max,
      this.maxValue
    );
  };
}
