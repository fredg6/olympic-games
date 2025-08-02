import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType, GoogleChart } from 'angular-google-charts';
import { filter, mergeAll, Observable, take } from 'rxjs';
import { ChartDataType } from '../../core/models/chart-data.type';
import { Olympic } from '../../core/models/Olympic';
import { TotalNumberDataType } from '../../core/models/total-number-data.type';
import { OlympicService } from '../../core/services/olympic-games-api';
import { PageInfoCard } from '../../shared/page-info-card/page-info-card';

@Component({
  selector: 'app-detail',
  imports: [
    GoogleChart,
    MatGridListModule,
    MatGridTile,
    MatButtonModule,
    PageInfoCard,
    AsyncPipe
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail implements OnInit {
  lineChartType = ChartType.LineChart;
  lineChartColumns = [
    'Year', 
    'Number of medals',
    {'type': 'string', 'role': 'tooltip', 'p': {'html': true}}
  ];
  lineChartData!: ChartDataType[][];
  lineChartOptions = {
    backgroundColor: 'transparent',
    colors: ['#793D52', '#89A1DB', '#9780A1', '#BFE0F1', '#B8CBE7', '#956065'],
    fontName: 'Montserrat', 
    hAxis : {
      baselineColor: 'transparent',
      format: '#',
      gridlines: {
        color: '#858585',
        interval: 4
      },
      minorGridlines: {
        count: 0
      },
      textStyle: {
        color: '#424242',
        fontSize: 14
      },
      title: 'Dates',
      titleTextStyle: {
        color: '#686868',
        fontSize: 20,
        italic: false
      }
    },
    legend: {
      position: 'none'
    },
    tooltip: {
      ignoreBounds: true,
      isHtml: true
    }, 
    vAxis : {
      baselineColor: 'transparent',
      format: '#',
      gridlines: {
        color: '#858585',
        /* count: 5 */
      },
      minorGridlines: {
        count: 0
      },
      textStyle: {
        color: '#424242',
        fontSize: 14
      }
    }
  };
  
  olympic$!: Observable<Olympic>;
  totalNumberOfMedals!: number;
  totalNumberOfAthletes!: number;
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicService);
  
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.olympic$ = this.getOlympic$(id);
    this.computeTotalNumber('medals');
    this.computeTotalNumber('athletes');
    this.buildLineChartData();
  }
  
  protected goBack(): void {
    this.router.navigate(['']);
  }

  private getOlympic$(id: number): Observable<Olympic> {
    return this.olympicService.getOlympics$().pipe(
      mergeAll(),
      filter(olympic => olympic.id == id),
      take(1)
    )
  }

  private computeTotalNumber(dataType: TotalNumberDataType): void {
    this.olympic$.subscribe(olympic => {
      if (dataType === 'medals') {
        this.totalNumberOfMedals = this.olympicService.computeCountryTotalNumber(olympic.participations, 'medals');
      } else if (dataType === 'athletes') {
        this.totalNumberOfAthletes = this.olympicService.computeCountryTotalNumber(olympic.participations, 'athletes');
      }
    });
  }

  private buildLineChartData(): void {
    this.olympic$.subscribe(olympic => {
      let lineChartData: ChartDataType[][] = [];
      
      olympic.participations.forEach(participation => {
        let lineChartDataItem = Array.of<ChartDataType>(
          participation.year,
          participation.medalsCount,
          this.olympicService.createChartTooltipHTMLContent(participation.year, participation.medalsCount)
        );
        lineChartData.push(lineChartDataItem);
      });

      this.lineChartData = lineChartData;
    });
  }
}