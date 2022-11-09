import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSliderMilestone]',
  exportAs: 'sliderMilestone',
})
export class SliderMilestoneDirective implements AfterViewInit, OnInit {
  @Input() milestone: number[] = [10, 100];
  @Input() min = 0;
  @Input() max = 100;
  // @Input() minValue = 1;
  @Input() maxValue = 2500;
  @Input() value = 1;
  nodes = [];
  exactWidth = 0;
  // scale = 0;
  // position = 0;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngAfterViewInit() {
    this.addMilestone();
  }

  ngOnInit() {
    this.sortAndCheckDuplicate();
  }

  addMilestone = () => {
    const sliderEl = this.elRef.nativeElement.querySelector('.p-slider');
    const milestoneEl = this.renderer.createElement('div');

    milestoneEl.classList.add('milestone-container');
    this.renderer.appendChild(sliderEl, milestoneEl);
    this.calculateMilestoneNode();
  };

  createMilestoneNode = (val: number, index: number) => {
    const isHasLabel = val === this.maxValue || val === this.min ? 'km' : '';
    const milestoneEl = this.elRef.nativeElement.querySelector(
      '.milestone-container'
    );
    const nodeEl = this.renderer.createElement('span');
    const nodeContent = this.renderer.createText(`${val}`);

    const nodeLabelEl = this.renderer.createElement('span');
    const nodeLabelContent = this.renderer.createText(isHasLabel);

    nodeEl.classList.add(`milestone-value-${index}`);
    this.renderer.appendChild(milestoneEl, nodeEl);
    this.renderer.appendChild(milestoneEl, nodeLabelEl);
    this.renderer.appendChild(nodeEl, nodeContent);
    this.renderer.appendChild(nodeLabelEl, nodeLabelContent);
  };

  calculateMilestoneNode = () => {
    this.milestone.forEach((x, i) => {
      this.createMilestoneNode(x, i);

      const milestoneVal = this.getPositionFromValue(x);
      const set: { [key: string]: number | string } = {};
      const style = this.elRef.nativeElement.querySelector(
        `.milestone-value-${i}`
      ).style;

      const calWidth = (milestoneVal / this.max) * 100 - this.exactWidth;

      this.exactWidth = this.exactWidth + calWidth;

      // set['width'] = `${calWidth}%`;
      set['width'] = x === 0 ? 'fit-content' : `${calWidth}%`;

      Object.entries(set).forEach(([name, value]) => {
        style.setProperty(name, value, 'important');
      });
    });
  };

  sortAndCheckDuplicate = () => {
    this.milestone.push(this.maxValue, this.min);
    this.milestone.sort((a, b) => a - b);
    this.milestone = [...new Set(this.milestone)];
  };

  changeValue = (eventData: {
    event: MouseEvent | PointerEvent;
    value: number;
  }) => {
    // const data = this.getValues();
    let position = eventData.value;
    if (position > 190) {
      position = this.round10(position);
      console.log({ position });
      eventData.value = position;
    }
    // this.setPositionValue(position);
  };

  setPositionValue(position: number, data?: any) {
    // this.value = +this.getLogValueFromPosition(position, data).toFixed(0);
    this.control.control!.setValue(position);
  }

  // getValues() {
  //   const data = {
  //     min: this.min,
  //     max: this.max,
  //     scale: +this.scale,
  //     value: +this.value,
  //     position: this.position,
  //     minValue: Math.log(this.minValue),
  //     maxValue: Math.log(this.maxValue),
  //   };
  //   data['scale'] = (data.maxValue - data.minValue) / (data.max - data.min);
  //   if (data.value) {
  //     data['position'] = this.getPositionFromLogValue(data);
  //   }
  //   return data;
  // }

  // // Calculate slider value from a position
  // getLogValueFromPosition(position: number, data: any) {
  //   return Math.exp((position - data.min) * data.scale + data.minValue);
  // }

  // // Calculate slider position from a value
  // getPositionFromLogValue(data: any, step: number = 0) {
  //   return (
  //     data.min +
  //     (Math.log(step ? step : data.value) - data.minValue) / data.scale
  //   );
  // }

  getPositionFromValue(value: number) {
    // 0 - 10
    // 11 - 100
    // 100 - max
    let position;
    if (value <= 10) {
      position = value / 0.1;
    } else if (value > 10 && value <= 100) {
      position = 100 + value - 10;
    } else {
      value -= 10 + 90;
      let roundNumber = Math.ceil(value / 100);
      const isRedundant = roundNumber * 100 - value;
      position = 190;
      if (isRedundant > 0) {
        roundNumber -= 1;
      }
      position += roundNumber * 10;
    }
    return position;
  }

  round10(val: number) {
    if (val <= 190) {
      return val;
    }
    val -= 190;
    let round = 190;
    const sep = val % 10;
    if (sep >= 5) {
      round += val - sep;
    } else {
      round += val - sep + 10;
    }
    return round;
  }
}
