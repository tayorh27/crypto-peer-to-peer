import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/event.service';

import { LAYOUT_MODE, LAYOUT_WIDTH, TOPBAR, SIDEBAR_SIZE, SIDEBAR_COLOR, LAYOUT_POSITION } from '../layouts.model';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})

/**
 * Right-Sidebar Component
 */
export class RightsidebarComponent implements OnInit {

  isVisible: any;

  layout: string | undefined;
  mode: string | undefined;
  width: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  sidebarcolor: string | undefined;
  sidebarsize: string | undefined;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.mode = LAYOUT_MODE;
    this.width = LAYOUT_WIDTH;
    this.topbar = TOPBAR;
    this.sidebarcolor = SIDEBAR_COLOR;
    this.sidebarsize = SIDEBAR_SIZE;
    this.position = LAYOUT_POSITION;

    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute('data-layout');

    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }

  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);
  }

  changeWidth(width: string) {
    this.width = width;
    this.eventService.broadcast('changeWidth', width);
  }

  changePosition(scrollable: string) {
    this.position = scrollable;
    this.eventService.broadcast('changePosition', scrollable);
  }

  changeTopbar(topbar: string) {
    this.topbar = topbar;
    this.eventService.broadcast('changeTopbar', topbar);
  }

  changeSidebarColor(sidebarcolor: string) {
    this.sidebarcolor = sidebarcolor;
    this.eventService.broadcast('changeSidebarColor', sidebarcolor);
  }

  changeSidebarSize(sidebarsize: string) {
    this.sidebarsize = sidebarsize;
    this.eventService.broadcast('changeSidebarSize', sidebarsize);
  }
}