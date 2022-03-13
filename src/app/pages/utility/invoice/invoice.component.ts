import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

/**
 * Invoice Component
 */
export class InvoiceComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {

    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Invoices', active: true }
    ];
  }

}
