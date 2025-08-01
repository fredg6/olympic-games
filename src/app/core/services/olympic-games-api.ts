import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private http = inject(HttpClient);
  private olympicUrl = '/assets/mock/olympic.json';
  private olympics$ = new Subject<Olympic[]>();

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error('An error occured while loading initial data : ' + error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics$() {
    return this.olympics$.asObservable();
  }

  computeCountryTotalNumberOfMedals(countryParticipations: Participation[]): number {
    let toReturn: number = 0;
    countryParticipations.forEach(p => toReturn += p.medalsCount)
    return toReturn;
  }
}
