import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

/**
 * User Component
 */
export class UserComponent implements OnInit {

  @Input() users: Array<{
    id?: string;
    index?: number;
    image?: string;
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    status?: string;
    location?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
