import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Crypto } from '../interfaces/crypto.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiKey: string = '360e15748d258c06e55f6f9d42021665f090af3b';
  private apiUrl: string = environment.apiUrl;
  private _historial: string[] = [];
  private _moneda: string = '';
  private pagina: string = '';

  get historial() {
    return [...this._historial];
  }

  get moneda() {
    return [this._moneda];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this._moneda = JSON.parse(localStorage.getItem('moneda')!) || 'USD';
  }

  get httpParams() {
    return new HttpParams()
      .set('convert', this.moneda[0])
      .set('page', this.pagina)
      .set('key', this.apiKey);
  }

  buscarCrypto(termino: string, historial: boolean): Observable<Crypto[]> {
    if (historial) {
      if (!this._historial.includes(termino.toUpperCase())) {
        this._historial.unshift(termino.toUpperCase());
        this._historial = this._historial.splice(0, 10);

        localStorage.setItem('historial', JSON.stringify(this._historial));
      }
    }

    const url = `${this.apiUrl}/currencies/ticker?ids=${termino.toUpperCase()}`;
    return this.http.get<Crypto[]>(url, { params: this.httpParams });
  }

  buscarCryptoPorRango(): Observable<Crypto[]> {
    const url = `${this.apiUrl}/currencies/ticker`;

    return this.http.get<Crypto[]>(url, {
      params: this.httpParams.set('per-page', '10').set('page', '1'),
    });
  }

  buscarCryptoTodas(): Observable<Crypto[]> {
    const url = `${this.apiUrl}/currencies/ticker`;
    return this.http.get<Crypto[]>(url, {
      params: this.httpParams.set('per-page', '100'),
    });
  }

  actualizarMoneda(moneda: string) {
    this._moneda = moneda;
    localStorage.setItem('moneda', JSON.stringify(this._moneda));
  }

  actualizarPagina(pagina: string) {
    this.pagina = pagina;
  }
}
