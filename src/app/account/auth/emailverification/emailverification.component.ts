import { Component, OnInit } from '@angular/core';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.scss']
})

/**
 * Email Verification Component
 */
export class EmailverificationComponent implements OnInit {
  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  email = ""

  constructor() { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }

    let data = sessionStorage.getItem("authUser");
    if(data == null) {
      data = "{}"
    }
    var json = JSON.parse(data);
    this.email = json.email;
  }

}
