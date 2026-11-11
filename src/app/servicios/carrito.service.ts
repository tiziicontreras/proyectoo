import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class CarritoService {

  private apiUrl = "http://localhost/API_PROYECTOB/public/carrito";

  // Cantidad total de productos (la lee el menú)
  cantidadTotal = signal(0);

  constructor(private http: HttpClient) {
    this.actualizarContador();
  }

  // OBTENEMOS LOS PRODUCTOS DEL CARRITO
  ver(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(lista =>
        this.cantidadTotal.set(
          lista.reduce((suma, i) => suma + Number(i.cantidad), 0)
        )
      )
    );
  }

  // Vuelve a pedir el carrito para refrescar el contador
  actualizarContador(): void {
    this.ver().subscribe({
      error: () => this.cantidadTotal.set(0)
    });
  }

  // AGREGAMOS UN PRODUCTO
  agregar(idProducto: number, cantidad: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, {
      id_producto: idProducto,
      cantidad
    }).pipe(tap(() => this.actualizarContador()));
  }

  // MÉTODO UTILIZADO POR OFERTAS Y PRODUCTOS
  agregarProducto(producto: any): void {
    this.agregar(producto.id, 1).subscribe();
  }

  // ACTUALIZAMOS LA CANTIDAD
  actualizar(idProducto: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${idProducto}`, {
      cantidad
    }).pipe(tap(() => this.actualizarContador()));
  }

  // ELIMINAMOS UN PRODUCTO
  eliminar(idProducto: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${idProducto}`)
      .pipe(tap(() => this.actualizarContador()));
  }

  // VACIAMOS EL CARRITO
  vaciar(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vaciar`)
      .pipe(tap(() => this.actualizarContador()));
  }

  // OBTENEMOS LA CANTIDAD TOTAL DE PRODUCTOS
  obtenerCantidadTotal(): number {
    return this.cantidadTotal();
  }
}