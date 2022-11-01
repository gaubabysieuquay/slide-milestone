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
})
export class SliderMilestoneDirective implements AfterViewInit {
  @Input() milestone: number[] = [10, 100];
  @Input() min: number = 0;
  @Input() max: number;
  @Input() equalizeSpacing: boolean = false;
  @Input() minValue: any = 1;
  @Input() maxValue: any = 1000;
  value: number;
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

  setPositionValue(position: any, data: any) {
    this.value = +this.getValueFromPosition(position, data).toFixed(1);
    this.control.control!.setValue(position);
  }

  getValues() {
    this.value = this.control.control!.value;

    let data = {
      min: Math.log(this.min),
      max: Math.log(this.max),
      scale: +this.scale,
      value: +this.value,
      position: this.position,
      minValue: this.minValue,
      maxValue: this.maxValue,
    };
    console.log(data);
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
  getPositionFromValue(data: any) {
    return data.minValue + (Math.log(data.value) - data.min) / data.scale;
  }
}
