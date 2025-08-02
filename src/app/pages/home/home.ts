import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ChartSelectionChangedEvent, ChartType, GoogleChart } from 'angular-google-charts';
import { Observable } from 'rxjs';
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
      const id = rowData.at(3);
      this.router.navigateByUrl(`detail/${id}`);
    } else {
      console.warn('Invalid row index:', rowIndex);
    }
  }
  
  private computeNumberOfJOs(): void {
    this.olympics$.subscribe(olympics => {
      let uniqueParticipationYears = 
        new Set(olympics.flatMap(olympic => olympic.participations.flatMap(participation => participation.year)));
      this.numberOfJOs = uniqueParticipationYears.size;
    });
  }
  
  private buildPieChartData(): void {
    this.olympics$.subscribe(olympics =>
      this.pieChartData = olympics.map(olympic => this.buildPieChartDataItem(olympic))
    );
  }

  private buildPieChartDataItem(olympic: Olympic): ChartDataType[] {
    let pieChartDataItem: ChartDataType[] = [];
    
    pieChartDataItem.push(olympic.country);
    const countryTotalNumberOfMedals = this.olympicService.computeCountryTotalNumber(olympic.participations, 'medals');
    pieChartDataItem.push(countryTotalNumberOfMedals);
    pieChartDataItem.push(this.olympicService.createChartTooltipHTMLContent(olympic.country, countryTotalNumberOfMedals));
    pieChartDataItem.push(olympic.id);

    return pieChartDataItem;
  }
}