import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})

/**
 * Elements Component
 */
export class ElementsComponent implements OnInit {

   // bread crumb items
   breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Form Elements', active: true }
    ];
  }

}
