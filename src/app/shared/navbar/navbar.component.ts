import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/main/services/crypto.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  monedas: string[] = ['USD', 'EUR', 'JPY', 'GBP', 'RUB'];
  id: string = '';

  get moneda() {
    return this.cryptoService.moneda;
  }

  constructor(private cryptoService: CryptoService, private router: Router) {}

  cambiarMoneda(moneda: string) {
    this.cryptoService.actualizarMoneda(moneda);

    let url = this.router.url.substring(1);

    if (url == '') {
      url = '#';
    }

    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([url]));
  }

  buscar() {
    if (this.id.length > 1) {
      this.router.navigate(['/details', this.id]);
    }
  }

  ngOnInit(): void {}
}
