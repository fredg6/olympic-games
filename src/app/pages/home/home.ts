import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { ChartType, GoogleChart } from 'angular-google-charts';
import { map, mergeAll, Observable, reduce, take } from 'rxjs';
import { ChartDataType } from '../../core/models/chart-data.type';
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
  pieChartColumns = [
    'Country', 
    'Total number of medals',
    {'type': 'string', 'role': 'tooltip', 'p': {'html': true}},
    'Country id'
  ];
  pieChartData$!: Observable<ChartDataType[][]>;
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
  numberOfJOs$!: Observable<number>;

  private olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics$();
    this.numberOfJOs$ = this.computeNumberOfJOs();
    this.pieChartData$ = this.buildPieChartData();
  }
  
  private computeNumberOfJOs(): Observable<number> {
    return this.olympics$.pipe(
      take(1),
      mergeAll(),
      map(olympic => olympic.participations),
      mergeAll(),
      map(participation => participation.year),
      reduce((set, year) => { 
        set.add(year);
        return set;
      }, new Set<number>()),
      map(set => set.size)
    );
  }
  
  private buildPieChartData(): Observable<ChartDataType[][]> {
    return this.olympics$.pipe( 
      map(olympics =>
        olympics.map(olympic => this.buildPieChartDataItem(olympic))
      )
    );
  }

  private buildPieChartDataItem(olympic: Olympic): ChartDataType[] {
    let pieChartDataItem: ChartDataType[] = [];
    
    pieChartDataItem.push(olympic.country);
    const countryTotalNumberOfMedals = this.olympicService.computeCountryTotalNumberOfMedals(olympic.participations);
    pieChartDataItem.push(countryTotalNumberOfMedals);
    pieChartDataItem.push(this.createPieChartTooltipHTMLContent(olympic.country, countryTotalNumberOfMedals));
    pieChartDataItem.push(olympic.id);

    return pieChartDataItem;
  }

  private createPieChartTooltipHTMLContent(country: string, totalNumberOfMedals: number): string {
    return '<div class="pieChartTooltip">' +
        '<span>' + country + '</span><br/>' +
        '<span><img src="/assets/images/medal.svg">' + totalNumberOfMedals + '</span>' +
        '</div>';
  }
}