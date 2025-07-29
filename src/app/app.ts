import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic-games-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
