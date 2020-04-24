import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  buttonText = "zurück";
  title = '';
  subtitle = '';
  description = '';
  isbn = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  	this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.state) {
        this.isbn = this.router.getCurrentNavigation().extras.state.isbn;
        this.title = this.router.getCurrentNavigation().extras.state.title;
        this.subtitle = this.router.getCurrentNavigation().extras.state.subtitle;
        this.description = this.router.getCurrentNavigation().extras.state.description;
      }
    });
  }

}
