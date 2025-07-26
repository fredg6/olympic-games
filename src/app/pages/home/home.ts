import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Olympic } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { PieChart } from '../../shared/charts/pie-chart/pie-chart';

@Component({
  selector: 'app-home',
  imports: [PieChart],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  olympics$!: Observable<Olympic[]>;

  private olympicService = inject(OlympicService);

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
