import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterLink
  ],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss']
})
export class NotFound implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}