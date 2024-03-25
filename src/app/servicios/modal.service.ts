import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ModalService {
  private modalResultSubject: Subject<any> = new Subject<any>();

  constructor(private modalService: NgbModal) { }

  openModal(viewModal: any, size: string): Observable<any> {
    const modalRef: NgbModalRef = this.modalService.open(viewModal, {
      size: size,
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        // Emite el resultado del modal al observable
        this.modalResultSubject.next(result);
      },
      (reason) => {
        // Si el modal se cierra sin resultados, emite null al observable
        this.modalResultSubject.next(null);
      }
    );

    // Retorna un observable que emite el resultado del modal
    return this.modalResultSubject.asObservable();
  }
}
