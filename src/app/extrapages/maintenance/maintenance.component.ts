import { Component, OnInit } from '@angular/core';
import { LAYOUT_MODE } from '../../layouts/layouts.model';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})

/**
 * Maintenance-Component Component
 */
export class MaintenanceComponent implements OnInit {
  layout_mode!: string;

  constructor() { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
  }

}
