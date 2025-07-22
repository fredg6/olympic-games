import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  public olympics$: Observable<any> = of(null);

  private olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
