import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  imports: [],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail {
  private router = inject(Router);
  
  protected goBack(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
