import { Component, OnInit } from '@angular/core';
import { LabelType, Options } from 'ng5-slider';

@Component({
  selector: 'app-rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})

/**
 * Range-slider Component
 */
export class RangesliderComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  /***
   * Multiple Range slider value
   */
  defaultVal = 10;
  defaultOption: Options = {
    floor: 10,
    ceil: 100,
    showSelectionBar: true
  };

  minValue = 550;
  minOptions: Options = {
    floor: 100,
    ceil: 1000,
    showSelectionBar: true
  };

  prefixValue = 200;
  prefix = 800;
  prefixOption: Options = {
    floor: 0,
    ceil: 1000,
  };

  rangValue = -500;
  rang = 500;
  rangOption: Options = {
    floor: -1000,
    ceil: 1000,
  };

  stepValue = -500;
  step = 500;
  stepOption: Options = {
    floor: -1000,
    ceil: 1000,
    step: 250
  };

  tickValue = 6;
  tickValueoptions: Options = {
    showTicksValues: true,
    showSelectionBar: true,
    stepsArray: [
      { value: 1, legend: 'January' },
      { value: 2, legend: 'February' },
      { value: 3, legend: 'March' },
      { value: 4, legend: 'April' },
      { value: 5, legend: 'May' },
      { value: 6, legend: 'June' },
      { value: 7, legend: 'July' },
      { value: 8, legend: 'August' },
      { value: 9, legend: 'September' },
      { value: 10, legend: 'October' },
      { value: 11, legend: 'November' },
      { value: 12, legend: 'December' }
    ]
  };

  prettifyValue = 200000;
  prettifyOption: Options = {
    floor: 1000,
    ceil: 1000000,
    showSelectionBar: true
  };

  disabledValue = 550;
  disabledOption: Options = {
    floor: 100,
    ceil: 1000,
    showSelectionBar: true
  };

  extraValue = 30;
  extraOption: Options = {
    floor: 18,
    ceil: 70,
    showSelectionBar: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return 'Age' + value;
        default:
          return '' + value;
      }
    }
  };

  postfixesValue: number = 0;
  postfixesOption: Options = {
    floor: -90,
    ceil: 90,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + 'Ã‚Â°';
        default:
          return '' + value;
      }
    }
  };

  decorateValue: number = 145;
  decorate: number = 155;
  decorateOption: Options = {
    floor: 100,
    ceil: 200,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return 'Weight: ' + value + ' million pounds';
        case LabelType.High:
          return 'Weight: ' + value + ' million pounds';
        default:
          return '$' + value;
      }
    }
  };

  hideValue = 1200;
  hide = 1800;
  hideOption: Options = {
    floor: 1000,
    ceil: 2000,
  };

  constructor() { }

  ngOnInit(): void {
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'UI Elements' },
      { label: 'Range Slider', active: true }
    ];
  }

}
