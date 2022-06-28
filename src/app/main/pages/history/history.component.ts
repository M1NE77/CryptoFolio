import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [ConfirmationService],
})
export class HistoryComponent implements OnInit {
  historial: Array<string> = [];
  portafolio: Map<string, number> = new Map<string, number>();

  constructor(
    private cryptoService: CryptoService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('portafolio')!) != undefined) {
      this.portafolio = new Map(
        Object.entries(JSON.parse(localStorage.getItem('portafolio')!))
      );
    }

    this.historial = this.cryptoService.historial;
  }

  buscar(id: string) {
    this.router.navigateByUrl('/details/' + id);
  }

  eliminar(id: string) {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar <b>' +
        id +
        '</b> de tu historial?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.historial = this.historial.filter((e) => e !== id);
        localStorage.setItem('historial', JSON.stringify(this.historial));
      },
    });
  }
}
