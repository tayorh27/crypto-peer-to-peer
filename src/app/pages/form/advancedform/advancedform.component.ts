import { Component, OnInit, ViewChild, EventEmitter, Output, Input, } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateStruct, } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, THEME } from 'ng-wizard';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-advancedform',
  templateUrl: './advancedform.component.html',
  styleUrls: ['./advancedform.component.scss'],
})

/**
 * Advanced-Form Component
 */
export class AdvancedformComponent implements OnInit {

  public Editor = ClassicEditor;
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  selectedDate = '';
  basicDemoValue = '2017-01-01';

  date1 = new Date(new Date().setDate(new Date().getDate() + 2));
  date2 = new Date(new Date().setDate(new Date().getDate() + 4));

  disabledDate = [this.date1, this.date2];

  /**
  * Wizard config
  */
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.default,
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Finish',
          class: 'btn btn-info',
          event: () => {
            alert('Finished!!!');
          },
        },
      ],
    },
  };

  /***
  * Wizart1 config
  */
  config1: NgWizardConfig = {
    selected: 0,
    theme: THEME.dots,
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Finish',
          class: 'btn btn-info',
          event: () => {
            alert('Finished!!!');
          },
        },
      ],
    },
  };

  /***
   * file upload
   */
  files: File[] = [];

  // Component colorpicker
  color!: string;
  rgbcolor!: string;
  palettecolor!: string;
  togglepalettecolor!: string;
  initialcolor!: string;
  inputcolor!: string;

  // Form submition
  submit!: boolean;
  formsubmit!: boolean;
  validationform!: FormGroup; // bootstrap validation form
  tooltipvalidationform!: FormGroup; // bootstrap tooltip validation form

  data: Select2Data = [
    {
      label: 'Alaskan/Hawaiian Time Zone',
      data: {
        name: 'Alaskan/Hawaiian Time Zone',
      },
      options: [
        {
          value: 'alaska',
          label: 'Alaska',
          data: {
            name: 'Alaska',
          },
          templateId: 'template1',
          id: 'option-alaska',
        },
        {
          value: 'hawaii',
          label: 'Hawaii',
          data: {
            name: 'Hawaii',
          },
          templateId: 'template2',
          id: 'option-hawaii',
        },
      ],
    },
    {
      label: 'Pacific Time Zone',
      data: {
        name: 'Pacific Time Zone',
      },
      options: [
        {
          value: 'california',
          label: 'California',
          data: {
            name: 'California',
          },
          templateId: 'template1',
          id: 'option-california',
        },
        {
          value: 'nevada',
          label: 'Nevada',
          data: {
            name: 'Nevada',
          },
          templateId: 'template2',
          id: 'option-nevada',
        },
        {
          value: 'oregon',
          label: 'Oregon',
          data: {
            name: 'Oregon',
          },
          templateId: 'template3',
          id: 'option-oregon',
        },
        {
          value: 'washington',
          label: 'Washington',
          data: {
            name: 'Washington',
          },
          templateId: 'template4',
          id: 'option-washington',
        },
      ],
    },
  ];

  constructor(
    public formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    private ngWizardService: NgWizardService
  ) { }

  model!: NgbDateStruct;
  date!: { year: number; month: number };
  hoveredDate!: NgbDate;
  fromNGDate!: NgbDate;
  toNGDate!: NgbDate;
  hidden!: boolean;
  selected: any;
  @Input() fromDate!: Date;
  @Input() toDate!: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', { static: true }) datePicker: any;

  ngOnInit(): void {

    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Form Advanced', active: true }
    ];

    this.color = '#4a7484';
    this.rgbcolor = 'rgba(244, 106, 106, 0.6)';
    this.palettecolor = '#34c3af';
    this.togglepalettecolor = '#674ea7';
    this.initialcolor = '#fbc15e';
    this.inputcolor = '#f46a6a';

    /**
     * Bootstrap validation form data
     */
    this.validationform = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z0-9]+')],
      ],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      zip: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
    });

    /**
     * Bootstrap tooltip validation form data
     */
    this.tooltipvalidationform = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z0-9]+')],
      ],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      userName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
    });
  }

  /**
   * Returns form
   */
  get form() {
    return this.validationform.controls;
  }

  /**
   * returns tooltip validation form
   */
  get formData() {
    return this.tooltipvalidationform.controls;
  }

  /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    this.submit = true;
  }

  /**
   * Bootstrap tooltip form validation submit method
   */
  formSubmit() {
    this.formsubmit = true;
  }

  /**
   * Is hovered over date
   * @param date date obj
   */
  isHovered(date: NgbDate) {
    return (
      this.fromNGDate &&
      !this.toNGDate &&
      this.hoveredDate &&
      date.after(this.fromNGDate) &&
      date.before(this.hoveredDate)
    );
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
   * @param date date obj
   */
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromNGDate) ||
      date.equals(this.toNGDate) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  /**
   * Select the today
   */
  selectToday() {
    this.model = this.calendar.getToday();
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  /***
   * Wizard step changed
   */
  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
  }

  isValidTypeBoolean: boolean = true;

  /***
   * Wizard valid Function return boolean
   */
  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  /***
   * Wizard step changed return observable
   */
  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }
}
