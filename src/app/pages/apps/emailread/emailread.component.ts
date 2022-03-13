import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-emailread',
  templateUrl: './emailread.component.html',
  styleUrls: ['./emailread.component.scss']
})

/**
 * Email-Read Component
 */
export class EmailreadComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Email' },
      { label: 'Read Email', active: true }
    ];
  }

  /**
   * Open modal
   * @param content content
   */
  open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  
}
