import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({ providedIn: "root" })
export class TicketService {
 private apiUrl = "http://localhost/API_PROYECTOB/public/tickets";
 // Dirección base para armar el link de descarga del PDF
 readonly baseArchivos = "http://localhost/API_PROYECTOB/public/";
 constructor(private http: HttpClient) {}
 // POST /tickets/generar/{id_compra}: le pide al backend que cree el PDF
 generar(idCompra: number): Observable<any> {
 return this.http.post(`${this.apiUrl}/generar/${idCompra}`, {});
 }
 // GET /tickets/{id_compra}: trae los datos del ticket (número, fecha, ruta del PDF)
 ver(idCompra: number): Observable<any> {
 return this.http.get(`${this.apiUrl}/${idCompra}`);
 }
}