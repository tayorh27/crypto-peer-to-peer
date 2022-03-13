import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

/**
 * Basic-Table Component
 */
export class BasicComponent implements OnInit {

   // bread crumb items
   breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Tables' },
      { label: 'Basic Tables', active: true }
    ];
  }

}
