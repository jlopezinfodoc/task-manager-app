import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  /**
   * Muestra una alerta de éxito
   */
  success(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      timerProgressBar: true,
      showCloseButton: true
    });
  }

  /**
   * Muestra una alerta de error
   */
  error(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#dc3545'
    });
  }

  /**
   * Muestra una alerta de advertencia
   */
  warning(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107'
    });
  }

  /**
   * Muestra una alerta de información
   */
  info(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#0dcaf0'
    });
  }

  /**
   * Muestra una alerta de confirmación
   */
  confirm(title: string, message?: string, confirmText: string = 'Sí, confirmar'): Promise<any> {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    });
  }

  /**
   * Muestra una alerta de confirmación para eliminar
   */
  confirmDelete(itemName: string = 'este elemento'): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    });
  }

  /**
   * Muestra un toast de éxito (notificación pequeña)
   */
  toastSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  /**
   * Muestra un toast de error (notificación pequeña)
   */
  toastError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }

  /**
   * Muestra un toast de información (notificación pequeña)
   */
  toastInfo(message: string): void {
    Swal.fire({
      icon: 'info',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  /**
   * Muestra un loading con mensaje personalizado
   */
  showLoading(message: string = 'Cargando...'): void {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Cierra cualquier alerta activa
   */
  close(): void {
    Swal.close();
  }

  /**
   * Muestra una alerta personalizable con HTML
   */
  custom(options: any): Promise<any> {
    return Swal.fire(options);
  }
}
