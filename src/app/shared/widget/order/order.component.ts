import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

/**
 * Order Component
 */
export class OrderComponent implements OnInit {

  @Input() orders: Array<{
    id?: string;
    image?: string;
    index?: number;
    name?: string;
    date?: string;
    total?: string;
    status?: string;
    payment?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
