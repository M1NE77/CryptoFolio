import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  code: string = '';
  message: string = '';

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      this.code = params['code'];
      if (this.code == undefined) {
        this.code = "404";
      }

      if (this.code == '429') {
        this.message = "Se ha superado la tasa de peticiones por segundo de la versión gratuita de la API de Nomics."
      } else {
        this.message = window.atob(params['message']);
        if (this.message == undefined) {
          this.message = "Se ha producido un error inesperado.";
        }
      }
    });
  }

  ngOnInit(): void {}
}
