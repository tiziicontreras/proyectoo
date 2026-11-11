import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({ providedIn: "root" })
export class CompraService {
 private apiUrl = "http://localhost/API_PROYECTOB/public/compras";
 constructor(private http: HttpClient) {}
 // POST /compras/finalizar: registra la compra con lo que hay en el carrito y lo vacía
 finalizar(): Observable<any> { return this.http.post(`${this.apiUrl}/finalizar`,
{}); }
 // GET /compras: historial del usuario
 historial(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
}
