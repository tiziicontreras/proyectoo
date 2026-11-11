
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class FavoritoService {

  private apiUrl = "http://localhost/API_PROYECTOB/public/favoritos";

  constructor(private http: HttpClient) {}

  // OBTENEMOS LA LISTA DE FAVORITOS
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // AGREGAMOS UN FAVORITO
  agregar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, {
      id_producto: id
    });
  }

  // MÉTODO UTILIZADO POR OFERTAS
  agregarProducto(producto: any): void {
    this.agregar(producto.id).subscribe();
  }

  // ELIMINAMOS UN FAVORITO
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }
}
