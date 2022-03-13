import { Component, OnInit, ViewChild, Input, Inject, PLATFORM_ID } from '@angular/core';

import { MapsAPILoader } from '@agm/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})

/**
 * Maps Component
 */
export class MapsComponent implements OnInit {

   // bread crumb items
   breadCrumbItems!: Array<{}>;

  longitude = 20.728218;
  latitude = 52.128973;
  markers: any;
  zoom: number = 15;

  @ViewChild('streetviewMap', { static: true }) streetviewMap: any;
  @ViewChild('streetviewPano', { static: true }) streetviewPano: any;

  @Input() heading: number = 34;
  @Input() pitch: number = 10;
  @Input() scrollwheel: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private mapsAPILoader: MapsAPILoader) { }

  ngOnInit(): void {

    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Maps' },
      { label: 'Maps', active: true }
    ];

    if (isPlatformBrowser(this.platformId)) {
      this.mapsAPILoader.load().then(() => {
        const center = { lat: this.latitude, lng: this.longitude };
      });
    }
  }

}
