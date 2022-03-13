import { Component, OnInit, ViewChild } from '@angular/core';
import { alertData } from './data';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { AlertColor } from './notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

/**
 * Notification Component
 */
export class NotificationComponent implements OnInit {

  @ViewChild('staticAlert', { static: false }) staticAlert?: NgbAlert;

  alertData: AlertColor[] = [];
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  show = true;
  translucentToast = true;
  placeholderToast = true;
  staticAlertClosed = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => this.staticAlert?.close(), 20000);
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'UI Elements' },
      { label: 'Notifications', active: true }
    ];

    /***
     * Data Get 
    */
    this._fetchData();
  }

  /***
   * Notification Data Get
   */
  private _fetchData() {
    this.alertData = alertData;
  }

  closeToast() {
    this.show = false;
    setTimeout(() => this.show = true, 8000);
  }

  closeTranslucentToast() {
    this.translucentToast = false;
  }

  isplaceholderToast() {
    this.placeholderToast = false;
  }

  /***
   * Notification remove
   */
  close(alert: AlertColor, alertData: AlertColor[]) {
    alertData.splice(alertData.indexOf(alert), 1);
  }

}
