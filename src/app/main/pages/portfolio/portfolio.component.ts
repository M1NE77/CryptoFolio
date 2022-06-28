import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Crypto } from '../../interfaces/crypto.interface';
import { Subscription } from 'rxjs';
import { ConfirmationService, Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [ConfirmationService],
})
export class PortfolioComponent implements OnInit {
  portafolio: Map<string, number> = new Map<string, number>();
  busqueda: string = '';
  cantidad!: number | null;
  crypto!: Crypto | null;
  cryptoSeleccionada!: Crypto | null;
  cantidadCryptoSeleccionada: number = 0;
  cryptos: Crypto[] = [];
  precioTotal: number = 0;
  precioTotal1S: number = 0;
  precioTotal1M: number = 0;
  precioTotal1A: number = 0;
  precioTotalYTD: number = 0;
  ids: string = '';
  moneda = this.cryptoService.moneda[0];

  //Booleans
  error!: boolean | null;
  cantidadError: boolean = false;
  exito: boolean = false;
  eliminado: boolean = false;
  editado: boolean = false;
  existe: boolean = false;

  //Gráficas
  data: any;
  lineStylesData: any;
  subscription: Subscription;

  //Modal
  displayModal: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.busqueda = params['id'];
      if (this.busqueda != undefined) {
        this.buscar();
        this.cantidad = null;
      }
    });
  }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('portafolio')!) != undefined) {
      this.portafolio = new Map(
        Object.entries(JSON.parse(localStorage.getItem('portafolio')!))
      );

      this.obtenerCryptos();
    }
  }

  buscar() {
    this.exito = false;
    this.eliminado = false;
    this.editado = false;

    if (this.portafolio.has(this.busqueda)) {
      this.existe = true;
    } else if (this.busqueda.length > 0) {
      this.existe = false;

      this.cryptoService.buscarCrypto(this.busqueda, false).subscribe({
        next: (resp) => {
          if (resp.length > 0) {
            if (
              resp[0]['1d'] != undefined &&
              resp[0]['7d'] != undefined &&
              resp[0]['30d'] != undefined &&
              resp[0]['365d'] != undefined &&
              resp[0].ytd != undefined &&
              resp[0].symbol == this.busqueda
            ) {
              this.crypto = resp[0];
              this.error = false;
            } else {
              this.error = true;
            }
          } else {
            this.error = true;
          }
        },
        error: () => {
          this.error = true;
        },
      });
    } else {
      this.error = true;
    }
  }

  anadir() {
    if (
      this.cantidad != undefined &&
      !isNaN(this.cantidad) &&
      this.cantidad > 0
    ) {
      this.cantidadError = false;

      this.portafolio.set(this.busqueda.toUpperCase(), this.cantidad);

      const objFromMap = Object.fromEntries(this.portafolio);

      localStorage.setItem('portafolio', JSON.stringify(objFromMap));

      this.exito = true;
      this.reiniciar();
      this.obtenerCryptos();
    } else {
      this.cantidadError = true;
    }
  }

  eliminar(id: string, nombre: string) {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar <b>' +
        nombre +
        '</b> de tu portafolio?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.exito = false;
        this.editado = false;
        this.reiniciar();
        this.eliminado = true;

        this.portafolio.delete(id);
        const objFromMap = Object.fromEntries(this.portafolio);

        localStorage.setItem('portafolio', JSON.stringify(objFromMap));
        this.obtenerCryptos();
      },
    });
  }

  obtenerCryptos() {
    this.precioTotal = 0;
    this.precioTotal1S = 0;
    this.precioTotal1M = 0;
    this.precioTotal1A = 0;
    this.precioTotalYTD = 0;
    this.cryptos = [];
    this.ids = '';

    this.portafolio.forEach((value, key) => {
      this.ids += key + ',';
    });

    this.cryptoService.buscarCrypto(this.ids, false).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.cryptos = resp;

          this.portafolio.forEach((value, key) => {
            this.precioTotal +=
              parseFloat(this.cryptos.find((e) => e.symbol === key).price) *
              value;
          });

          this.portafolio.forEach((value, key) => {
            this.precioTotal1S +=
              (parseFloat(this.cryptos.find((e) => e.symbol === key).price) -
                parseFloat(
                  this.cryptos.find((e) => e.symbol === key)['7d'].price_change
                )) *
              value;
          });

          this.portafolio.forEach((value, key) => {
            this.precioTotal1M +=
              (parseFloat(this.cryptos.find((e) => e.symbol === key).price) -
                parseFloat(
                  this.cryptos.find((e) => e.symbol === key)['30d'].price_change
                )) *
              value;
          });

          this.portafolio.forEach((value, key) => {
            this.precioTotal1A +=
              (parseFloat(this.cryptos.find((e) => e.symbol === key).price) -
                parseFloat(
                  this.cryptos.find((e) => e.symbol === key)['365d']
                    .price_change
                )) *
              value;
          });

          this.portafolio.forEach((value, key) => {
            this.precioTotalYTD +=
              (parseFloat(this.cryptos.find((e) => e.symbol === key).price) -
                parseFloat(
                  this.cryptos.find((e) => e.symbol === key)['ytd'].price_change
                )) *
              value;
          });

          this.cargarGraficas();
        } else {
          this.router.navigate(['/error']);
        }
      },
      error: (e) => {
        this.router.navigate([
          '/error/' + e.status + '/' + window.btoa(e.statusText),
        ]);
      },
    });
  }

  cargarGraficas() {
    let colores = [];

    for (let i = 0; i < this.portafolio.size; i++) {
      colores.push(
        'rgb(' +
          (Math.floor(Math.random() * (200 - 0 + 1)) + 0) +
          ', ' +
          (Math.floor(Math.random() * (200 - 100 + 1)) + 100) +
          ', 255)'
      );
    }

    let totales: number[] = [];

    this.portafolio.forEach((value, key) => {
      totales.push(
        parseFloat(
          this.cryptos.filter((crypto) => crypto.symbol === key)[0].price
        ) * value
      );
    });

    this.data = {
      labels: Array.from(this.portafolio.keys()),
      datasets: [
        {
          data: totales,
          backgroundColor: colores,
        },
      ],
    };

    this.lineStylesData = {
      labels: ['YTD', 'Hace 1 año', 'Hace 1 mes', 'Hace 1 semana', 'Ahora'],
      datasets: [
        {
          label: 'Total del portafolio',
          data: [
            this.precioTotalYTD,
            this.precioTotal1A,
            this.precioTotal1M,
            this.precioTotal1S,
            this.precioTotal,
          ],
          fill: true,
          borderColor: '#33DCFF',
          tension: 0.4,
          backgroundColor: 'rgba(51,220,255,0.2)',
        },
      ],
    };
  }

  obtenerCantidad() {
    this.cantidadCryptoSeleccionada = this.portafolio.get(
      this.cryptoSeleccionada.symbol
    );
  }

  actualizarCrypto() {
    if (this.cantidadCryptoSeleccionada > 0) {
      this.portafolio.set(
        this.cryptoSeleccionada.symbol,
        this.cantidadCryptoSeleccionada
      );

      const objFromMap = Object.fromEntries(this.portafolio);

      localStorage.setItem('portafolio', JSON.stringify(objFromMap));

      this.exito = false;
      this.editado = true;
      this.reiniciar();
      this.eliminado = false;

      this.displayModal = false;
      this.obtenerCryptos();
    }
  }

  reiniciar() {
    this.busqueda = '';
    this.cantidad = null;
    this.error = null;
    this.existe = false;
    this.cantidadError = false;
    this.crypto = null;
  }
}
