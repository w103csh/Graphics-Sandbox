
import './slider.css';

export class Slider {

  public container: HTMLDivElement;
  public rangeSlider: HTMLInputElement;
  public numberBox: HTMLInputElement;
  public min: number;
  public max: number;
  public increment: number;
  public precision: number;
  public update: (value: number) => any;

  constructor(
    initialValue: number,
    min: number,
    max: number,
    increment: number,
    precision: number,
    cssClasses: string[],
    update: (value: number) => any
  ) {

    if(!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(increment) || !Number.isInteger(precision)) {
      console.error('Min, max, increment, and precisison must be integers.');
    }

    this.min = min;
    this.max = max;
    this.increment = increment;
    this.precision = precision;
    this.update = update;

    // container
    this.container = document.createElement('div');
    this.container.classList.add('slider-container');
    cssClasses.forEach(cssClass => this.container.classList.add(cssClass));
    // range slider
    this.rangeSlider = document.createElement('input');
    this.rangeSlider.classList.add('slider-range-slider');
    this.rangeSlider.type = 'range';
    this.setRangeMinMax();
    this.rangeSlider.value = this.getValueForRangeSlider(initialValue).toFixed(this.precision);
    this.container.appendChild(this.rangeSlider);
    // number box
    this.numberBox = document.createElement('input');
    this.numberBox.classList.add('slider-number-box');
    this.numberBox.type = 'number';
    this.numberBox.value = initialValue.toString();
    this.container.appendChild(this.numberBox);

    this.registerListeners();
  }

  private setRangeMinMax() {
    this.rangeSlider.min = this.min.toString();
    this.rangeSlider.max = (this.min + this.increment).toString();
  }

  private getValueForNumberBox(value: number): number {
    let rat = Math.abs(this.min - value) / this.increment;
    let diffRat = (this.max - this.min) * rat;
    return this.min + diffRat;
  }

  private getValueForRangeSlider(value: number): number {
    let rat = (value - this.min) / (this.max - this.min);
    return this.min + (this.increment * rat);
  }

  private registerListeners() {
    var control = this;
    // range slider
    this.rangeSlider.onchange = function(this: HTMLInputElement, ev: Event) {
      let val = Number(this.value);
      val = control.getValueForNumberBox(val);
      control.update(val);
      control.numberBox.value = val.toFixed(control.precision); 
    }
    // number box
    this.numberBox.onchange = function(this: HTMLInputElement, ev: Event) {
      let val = Number(this.value);
      if(val < control.min || val > control.max) {
        this.value = (val < control.min ? control.min : val > control.max ? control.max : control.min).toString();
      }
      val = control.getValueForNumberBox(val);
      control.update(val);
      control.rangeSlider.value = val.toFixed(control.precision);
    }
  }
}