import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSliderMilestone]',
  exportAs: 'sliderMilestone',
})
export class SliderMilestoneDirective implements AfterViewInit {
  @Input() milestone: number[] = [10, 100];
  @Input() min = 0;
  @Input() max = 100;
  @Input() equalizeSpacing = false;
  @Input() minValue = 1;
  @Input() maxValue = 2500;
  @Input() value = 1;
  nodes = [];
  exactWidth: number = 0;
  scale = 0;
  position = 0;

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

  createMilestoneNode = (val: number) => {
    const milestoneEl = this.elRef.nativeElement.querySelector(
      '.milestone-container'
    );
    const nodeEl = this.renderer.createElement('span');
    const nodeContent = this.renderer.createText(`${val}`);

    nodeEl.classList.add(`milestone-value-${val}`);
    this.renderer.appendChild(milestoneEl, nodeEl);
    this.renderer.appendChild(nodeEl, nodeContent);
  };

  calculateMilestoneNode = () => {
    this.milestone.forEach((x) => {
      this.createMilestoneNode(x);

      const set: { [key: string]: number | string } = {};
      const style = this.elRef.nativeElement.querySelector(
        `.milestone-value-${x}`
      ).style;
      const calWidth = (x / this.max) * 100 - this.exactWidth;
      this.exactWidth = this.exactWidth + calWidth;

      set['width'] = `${calWidth}%`;

      Object.entries(set).forEach(([name, value]) => {
        style.setProperty(name, value, 'important');
      });
    });
  };

  sortAndCheckDuplicate = () => {
    this.milestone.push(this.max, this.min);
    this.milestone.sort((a, b) => a - b);
    this.milestone = [...new Set(this.milestone)];
  };

  changeValue = (eventData: {
    event: MouseEvent | PointerEvent;
    value: number;
  }) => {
    const data = this.getValues();
    console.log(
      '🚀 ~ file: slider-milestone.directive.ts ~ line 92 ~ SliderMilestoneDirective ~ data',
      data
    );
    this.setPositionValue(eventData.value, data);
  };

  setPositionValue(position: number, data: any) {
    this.value = +this.getValueFromPosition(position, data).toFixed(0);
    this.control.control!.setValue(position);
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
  getValueFromPosition(position: number, data: any) {
    return Math.exp((position - data.min) * data.scale + data.minValue);
  }

  // Calculate slider position from a value
  getPositionFromValue(data: any, step: number = 0) {
    return (
      data.min +
      (Math.log(step ? step : data.value) - data.minValue) / data.scale
    );
  }
}
