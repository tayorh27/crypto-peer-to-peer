import { Component, OnInit } from '@angular/core';
import {
  linewithDataChart,
  dashedLineChart,
  splineAreaChart,
  basicColumChart,
  columnlabelChart,
  barChart,
  lineColumAreaChart,
  candlestickChart,
  timelinechart,
  basictimelinechart,
  piechart,
  donutchart,
  radialchart,
  radialbarchart,
  radarchart,
  multipleradarchart,
  basicpolarchart,
  polarchart,
  simpleBubbleChart,
  basicScatterChart,
  basicHeatmapChart,
  basicTreemapChart
} from './data';
import { ChartType } from './dashboard.model';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})

/**
 * Charts Component
 */
export class ChartsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  linewithDataChart!: ChartType;
  dashedLineChart!: ChartType;
  splineAreaChart!: ChartType;
  basicColumChart!: ChartType;
  columnlabelChart!: ChartType;
  barChart!: ChartType;
  lineColumAreaChart!: ChartType;
  candlestickChart!: ChartType;
  timelinechart!: ChartType;
  basictimelinechart!: ChartType;
  piechart!: ChartType;
  donutchart!: ChartType;
  radialchart!: ChartType;
  radialbarchart!: ChartType;
  radarchart!: ChartType;
  multipleradarchart!: ChartType;
  basicpolarchart!: ChartType;
  polarchart!: ChartType;
  simpleBubbleChart!: ChartType;
  basicScatterChart!: ChartType;
  basicHeatmapChart!: ChartType;
  basicTreemapChart!: ChartType;

  constructor() { }

  ngOnInit(): void {

    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Charts' },
      { label: 'Charts', active: true }
    ];

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.linewithDataChart = linewithDataChart;
    this.dashedLineChart = dashedLineChart;
    this.splineAreaChart = splineAreaChart;
    this.basicColumChart = basicColumChart;
    this.columnlabelChart = columnlabelChart;
    this.barChart = barChart;
    this.lineColumAreaChart = lineColumAreaChart;
    this.candlestickChart = candlestickChart;
    this.timelinechart = timelinechart;
    this.basictimelinechart = basictimelinechart;
    this.piechart = piechart;
    this.donutchart = donutchart;
    this.radialchart = radialchart;
    this.radialbarchart = radialbarchart;
    this.radarchart = radarchart;
    this.multipleradarchart = multipleradarchart;
    this.basicpolarchart = basicpolarchart;
    this.polarchart = polarchart;
    this.simpleBubbleChart = simpleBubbleChart;
    this.basicScatterChart = basicScatterChart;
    this.basicHeatmapChart = basicHeatmapChart;
    this.basicTreemapChart = basicTreemapChart;
  }
}
