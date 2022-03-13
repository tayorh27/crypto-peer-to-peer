import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})

/**
 * Transaction Component
 */
export class TransactionComponent implements OnInit {

  @Input() transactions: Array<{
    image?: string;
    id?: string;
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
