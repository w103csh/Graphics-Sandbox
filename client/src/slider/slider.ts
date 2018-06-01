
export class Slider {

  public container: HTMLDivElement;
  public rangeSlider: HTMLInputElement;
  public numberBox: HTMLInputElement;
  public min: number;
  public max: number;
  public increment: number;

  constructor(initialValue: number, min: number, max: number, increment: number) {
    if(!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(increment)) {
      console.error('Min, max, and increment must be integers.');
    }
    this.min = min;
    this.max = max;
    this.increment = increment;
    // container
    this.container = document.createElement('div');
    this.container.classList.add('slider-container');
    // range slider
    this.rangeSlider = document.createElement('input');
    this.rangeSlider.classList.add('slider-range-slider');
    this.rangeSlider.type = 'range';
    this.setRangeMinMax();
    this.rangeSlider.value = this.getValueForRangeSlider(initialValue);
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

  private getValueForNumberBox(value: number): string {
    let rat = Math.abs(this.min - value) / this.increment;
    let diffRat = (this.max - this.min) * rat;
    return (this.min + diffRat).toString();
  }

  private getValueForRangeSlider(value: number): string {
    let rat = (value - this.min) / (this.max - this.min);
    return (this.min + (this.increment * rat)).toString();
  }

  private registerListeners() {
    var control = this;
    // range slider
    this.rangeSlider.onchange = function(this: HTMLInputElement, ev: Event) {
      let val = Number(this.value);
      if(Number.isNaN(val)) {
        console.error('Range slider value must be a number.');
      }
      control.numberBox.value = control.getValueForNumberBox(val);
    }
    // number box
    this.numberBox.onchange = function(this: HTMLInputElement, ev: Event) {
      let val = Number(this.value);
      if(Number.isNaN(val)) {
        console.error('Number box value must be a number.');
      }
      if(val < control.min || val > control.max) {
        this.value = (val < control.min ? control.min : val > control.max ? control.max : control.min).toString();
      }
      control.rangeSlider.value = control.getValueForRangeSlider(val);
    }
  }
// <div class="""slidecontainer">
// <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
// <p>Value: <span id="demo"></span></p>
// </div>
}