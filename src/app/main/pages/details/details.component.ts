import { Component, OnInit } from '@angular/core';
import { Crypto } from '../../interfaces/crypto.interface';
import { CryptoService } from '../../services/crypto.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const TradingView: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  portafolio: Map<string, number> = new Map<string, number>();
  hayError: boolean = false;
  id: string = '';
  crypto!: Crypto;
  moneda = this.cryptoService.moneda[0];

  constructor(
    private activatedRoute: ActivatedRoute,
    private cryptoService: CryptoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('portafolio')!) != undefined) {
      this.portafolio = new Map(
        Object.entries(JSON.parse(localStorage.getItem('portafolio')!))
      );
    }

    this.route.params.forEach((params) => {
      this.cryptoService.actualizarPagina('');
      this.buscar();
    });
  }

  buscar() {
    this.cryptoService.buscarCrypto(this.id, true).subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.crypto = resp[0];
          setTimeout(() => {
            this.widget();
          }, 0);
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

  widget() {
    new TradingView.MediumWidget({
      symbols: [[this.id, this.id + this.moneda + '|ALL']],
      chartOnly: false,
      width: '100%',
      height: '500',
      locale: 'es',
      colorTheme: 'light',
      gridLineColor: 'rgba(240, 243, 250, 0)',
      fontColor: '#787B86',
      isTransparent: false,
      autosize: false,
      showVolume: true,
      scalePosition: 'no',
      scaleMode: 'Normal',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
      noTimeScale: false,
      valuesTracking: '1',
      chartType: 'line',
      container_id: 'tradingview',
    });

    new TradingView.widget({
      autosize: true,
      symbol: this.id + this.moneda,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '1',
      locale: 'es',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      container_id: 'tradingview_pro',
    });
  }
}
