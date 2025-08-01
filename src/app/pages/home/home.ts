import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ChartSelectionChangedEvent, ChartType, GoogleChart } from 'angular-google-charts';
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
  pieChartData!: ChartDataType[][];
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
  numberOfJOs!: number;

  private olympicService = inject(OlympicService);
  private router = inject(Router);

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics$();
    this.computeNumberOfJOs();
    this.buildPieChartData();
  }
  
  protected toDetail(event: ChartSelectionChangedEvent): void {
    const rowIndex = event.selection.at(0)?.row;
    let rowData!: ChartDataType[];
    if (rowIndex !== null && rowIndex !== undefined) {
      rowData = this.pieChartData[rowIndex];
      const countryId = rowData.at(3);
      this.router.navigateByUrl(`detail/${countryId}`);
    } else {
      console.warn('Invalid row index:', rowIndex);
    }
  }
  
  private computeNumberOfJOs(): void {
    this.olympics$.pipe(
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
    ).subscribe(numberOfJOs => this.numberOfJOs = numberOfJOs);
  }
  
  private buildPieChartData(): void {
    this.olympics$.pipe(
      take(1), 
      map(olympics =>
        olympics.map(olympic => this.buildPieChartDataItem(olympic))
      )
    ).subscribe(pieChartData => this.pieChartData = pieChartData);
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