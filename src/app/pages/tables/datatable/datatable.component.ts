import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { Table } from './table.model';
import { tableData } from './data';
import { AdvancedService } from './datatable.service';
import { AdvancedSortableDirective, SortEvent } from './sortable.directive';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})

/**
 * Data-Table Component
 */
export class DatatableComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  tableData!: Table[];
  hideme: boolean[] = [];
  tables$: Observable<Table[]>;
  total$: Observable<number>;
  @ViewChildren(AdvancedSortableDirective)
  headers!: QueryList<AdvancedSortableDirective>;

  public isCollapsed = true;
  constructor(public service: AdvancedService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {

    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Tables' },
      { label: 'Datatables', active: true }
    ];
    /***
     * All Data Get
     */
    this._fetchData();
  }

  changeValue(i: any) {
    this.hideme[i] = !this.hideme[i];
  }

  /**
   * fetches the table value
   */
  _fetchData() {
    this.tableData = tableData;
    for (let i = 0; i <= this.tableData.length; i++) {
      this.hideme.push(true);
    }
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
