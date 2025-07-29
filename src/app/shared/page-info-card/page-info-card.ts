import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-page-info-card',
  imports: [
    MatCardModule
  ],
  templateUrl: './page-info-card.html',
  styleUrl: './page-info-card.scss'
})
export class PageInfoCard {
  label = input.required<string>();
  value = input.required<number>();
}