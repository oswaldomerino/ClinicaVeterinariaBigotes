import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RowSelectionService {
  private selectedRow!: HTMLElement;

  constructor() {
   
  }
  

  selectRow(row: HTMLElement): void {
    // Si había una fila seleccionada previamente, elimina la clase 'selected'
    if (this.selectedRow) {
      this.selectedRow.classList.remove('selected');
    }

    // Aplica la clase CSS 'selected' a la fila y guarda una referencia a ella
    row.classList.add('selected');
    this.selectedRow = row;
  }
}