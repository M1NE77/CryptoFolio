import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Crypto } from '../../interfaces/crypto.interface';
import { CryptoService } from '../../services/crypto.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css'],
})
export class AllComponent implements OnInit {
  portafolio: Map<string, number> = new Map<string, number>();
  hayError: boolean = false;
  termino = '';
  moneda = this.cryptoService.moneda[0];
  cryptos: Crypto[] = [];

  constructor(
    private cryptoService: CryptoService,
    private router: Router,
    private config: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('portafolio')!) != undefined) {
      this.portafolio = new Map(
        Object.entries(JSON.parse(localStorage.getItem('portafolio')!))
      );
    }

    this.buscar();

    this.config.setTranslation({
      startsWith: 'Empieza por',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina por',
      equals: 'Coincide',
      notEquals: 'No coincide',
      noFilter: 'Quitar filtro',
    });
  }

  buscar() {
    this.cryptoService.buscarCryptoTodas().subscribe({
      next: (resp) => {
        this.cryptos = resp;
      },
      error: (e) => {
        this.cryptos = [];
        console.log(e);
        this.router.navigate([
          '/error/' + e.status + '/' + window.btoa(e.statusText),
        ]);
      },
    });
  }

  cambiarPagina(pagina: any) {
    this.cryptoService.actualizarPagina(pagina.page + 1);
    this.cryptos = [];
    this.buscar();

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
