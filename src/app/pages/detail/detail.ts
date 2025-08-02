import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, mergeAll, Observable, take } from 'rxjs';
import { Olympic } from '../../core/models/Olympic';
import { TotalNumberDataType } from '../../core/models/total-number-data.type';
import { OlympicService } from '../../core/services/olympic-games-api';
import { PageInfoCard } from '../../shared/page-info-card/page-info-card';

@Component({
  selector: 'app-detail',
  imports: [
    MatGridListModule,
    MatGridTile,
    PageInfoCard,
    AsyncPipe
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail implements OnInit {
  olympic$!: Observable<Olympic>;
  totalNumberOfMedals!: number;
  totalNumberOfAthletes!: number;
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicService);
  
  ngOnInit(): void {
    const olympicId = this.route.snapshot.params['id'];
    this.olympic$ = this.getOlympic$(olympicId);
    this.computeTotalNumber('medals');
    this.computeTotalNumber('athletes');
  }
  
  protected goBack(): void {
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  private getOlympic$(olympicId: number): Observable<Olympic> {
    return this.olympicService.getOlympics$().pipe(
      mergeAll(),
      filter(olympic => olympic.id == olympicId),
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
}