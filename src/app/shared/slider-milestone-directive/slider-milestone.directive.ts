import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appSliderMilestone]',
})
export class SliderMilestoneDirective implements AfterViewInit {
  @Input() milestone: number[] = [10, 100];
  @Input() min: number = 0;
  @Input() max: number;
  @Input() equalizeSpacing: boolean = false;
  nodes = [];
  exactWidth: number = 0;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.addMilestone();
    console.log(this.elRef.nativeElement.querySelector('.p-slider'));
  }

  ngOnInit() {
    this.sortAndCheckDuplicate();
    console.log(this.elRef);
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

  equalAllMilestoneSectionWidth = () => {
    const countMilestone = this.milestone.length;
    const calWidth = 1 / countMilestone;
    let sliderRangeStyle =
      this.elRef.nativeElement.querySelector('.p-slider-range').style.width;
    console.log(sliderRangeStyle);
  };

  sortAndCheckDuplicate = () => {
    this.milestone.push(this.max, this.min);
    this.milestone.sort((a, b) => a - b);
    this.milestone = [...new Set(this.milestone)];
  };
}
