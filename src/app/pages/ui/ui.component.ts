import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})

/**
 * Ui Component
 */
export class UiComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  isCollapsed = false;
  isCollapsed1 = false;
  
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    document.getElementById('mainContent')?.classList.add('overflow-visible');
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'UI Elements' },
      { label: 'UI Elements', active: true }
    ];
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { windowClass: 'modal-holder' });
  }

  /**
   * Open extra large modal
   * @param exlargeModal extra large modal data
   */
  extraLarge(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'xl', windowClass: 'modal-holder', centered: true });
  }

  /**
   * Open Large modal
   * @param largeDataModal large modal data
   */
  largeModal(largeDataModal: any) {
    this.modalService.open(largeDataModal, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }

  /**
   * Open small modal
   * @param smallDataModal small modal data
   */
  smallModal(smallDataModal: any) {
    this.modalService.open(smallDataModal, { size: 'sm', windowClass: 'modal-holder', centered: true });
  }

  /**
   * Open small modal
   * @param smallDataModal small modal data
   */
  fullModal(smallDataModal: any) {
    this.modalService.open(smallDataModal, { size: 'fullscreen', windowClass: 'modal-holder' });
  }

  /**
   * Open center modal
   * @param centerDataModal center modal data
   */
  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true, windowClass: 'modal-holder' });
  }

  /**
   * Open scroll modal
   * @param scrollDataModal scroll modal data
   */
  scrollModal(scrollDataModal: any) {
    this.modalService.open(scrollDataModal, { scrollable: true });
  }

  /**
   * Open scroll modal
   * @param staticDataModal scroll modal data
   */
  staticModal(staticDataModal: any) {
    this.modalService.open(staticDataModal, { backdrop: 'static', keyboard: false, centered: true, windowClass: 'modal-holder' });
  }

}
