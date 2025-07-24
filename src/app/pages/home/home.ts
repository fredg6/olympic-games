import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Olympic } from '../../core/models/Olympic';
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
  public olympics$!: Observable<Olympic[]>;

  private olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
