import { Component, OnInit } from '@angular/core';
import { Crypto } from '../../interfaces/crypto.interface';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  portafolio: Map<string, number> = new Map<string, number>();
  hayError: boolean = false;
  termino = '';
  moneda = this.cryptoService.moneda[0];
  cryptos: Crypto[] = [];

  constructor(private cryptoService: CryptoService) {}

  buscar() {
    if (JSON.parse(localStorage.getItem('portafolio')!) != undefined) {
      this.portafolio = new Map(
        Object.entries(JSON.parse(localStorage.getItem('portafolio')!))
      );
    }

    this.hayError = false;

    this.cryptoService.buscarCryptoPorRango().subscribe({
      next: (resp) => {
        this.cryptos = resp;
      },
      error: (e) => {
        this.hayError = true;
        this.cryptos = [];
      },
    });
  }

  ngOnInit(): void {
    this.buscar();
  }
}
