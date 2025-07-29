// import { AsyncPipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { ChartType, GoogleChart } from 'angular-google-charts';
import { Observable } from 'rxjs';
import { Olympic } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic-games-api';
import { PageInfoCard } from '../../shared/page-info-card/page-info-card';

@Component({
  selector: 'app-home',
  imports: [
    GoogleChart,
    MatGridListModule,
    MatGridTile,
    PageInfoCard,
    AsyncPipe
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  pieChartType = ChartType.PieChart;
  
  pieChartData = [
    ['Germany', 892, this.createPieChartTooltipHTMLContent('Germany', 892)],
    ['United States', 1256, this.createPieChartTooltipHTMLContent('United States', 1256)],
    ['France', 765, this.createPieChartTooltipHTMLContent('France', 765)],
    ['United Kingdom', 543, this.createPieChartTooltipHTMLContent('United Kingdom', 543)],
    ['Spain', 765, this.createPieChartTooltipHTMLContent('Spain', 765)],
    ['Italy', 347, this.createPieChartTooltipHTMLContent('Italy', 347)]
  ];

  pieChartColumns = [
    'Country', 
    'Total number of medals',
    {'type': 'string', 'role': 'tooltip', 'p': {'html': true}}
  ];

  pieChartOptions = {
    backgroundColor: 'transparent',
    colors: ['#793D52', '#89A1DB', '#9780A1', '#BFE0F1', '#B8CBE7', '#956065'],
    legend: {
      position: 'labeled', 
      textStyle: {fontName: 'Montserrat', fontSize: 18}
    },
    pieSliceBorderColor: 'transparent',
    pieSliceText: 'none',
    pieStartAngle: -10,
    tooltip: {ignoreBounds: true, isHtml: true}
  };

  olympics$!: Observable<Olympic[]>;

  private olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }

  // getPieChartData(): ChartData<'pie', number[], string | string[]> {
  //   let pieChartData: ChartData<'pie', number[], string | string[]> = {
  //     datasets: [ {data: []} ],
  //     labels: []
  //   };

  //   this.olympics$.pipe( 
  //     mergeAll(),
  //     tap(olympic => {
  //       pieChartData.labels?.push(olympic.country);
  //       pieChartData.datasets.at(0)?.data.push(this.olympicService.computeCountryTotalNumberOfMedals(olympic.participations));
  //     })
  //   );

  //   return pieChartData;
  // }

  createPieChartTooltipHTMLContent(country: string, totalNumberOfMedals: number): string {
    return '<div class="pieChartTooltip">' +
        '<span>' + country + '</span><br/>' +
        '<span><img src="/assets/images/medal.svg">' + totalNumberOfMedals + '</span>' +
        '</div>';
  }
}