import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { LAYOUT_MODE } from '../../layouts/layouts.model';

@Component({
  selector: 'app-comingsoon',
  templateUrl: './comingsoon.component.html',
  styleUrls: ['./comingsoon.component.scss']
})

/**
 * Coming-soon Component
 */
export class ComingsoonComponent implements OnInit {
  layout_mode!: string;

  constructor() { }

  private _diff: number | undefined;
  _days: number | undefined;
  _hours: number | undefined;
  _minutes: number | undefined;
  _seconds: number | undefined;
  private _trialEndsAt: any;

  ngOnInit(): void {

    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    this._trialEndsAt = "2022-08-04";
    //Day Counter
    interval(1000).pipe(
      map((x) => {
        this._diff = Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
      })).subscribe((x) => {
        this._days = this.getDays(this._diff);
        this._hours = this.getHours(this._diff);
        this._minutes = this.getMinutes(this._diff);
        this._seconds = this.getSeconds(this._diff);
      });
  }
  /***
   * Get day
   */
  getDays(t: any) {
    return Math.floor(t / (1000 * 60 * 60 * 24));
  }

  /***
   * Get Hours
   */
  getHours(t: any) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  /***
   * Get Minutes
   */
  getMinutes(t: any) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  /***
   * Get Secounds
   */
  getSeconds(t: any) {
    return Math.floor((t / 1000) % 60);
  }

}
