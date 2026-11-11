// servicios/product.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Producto } from "../models/producto";
@Injectable({ providedIn: "root" })
export class ProductService {
 private apiUrl = "http://localhost/API_PROYECTOB/public/productos";
 constructor(private http: HttpClient) {}
 // listar() trae todos; listar("remera") trae solo los que coinciden
 listar(buscar: string = ""): Observable<Producto[]> {
 let params = new HttpParams();
 if (buscar) {
 params = params.set("buscar", buscar); // agrega ?buscar=remera
 }
 return this.http.get<Producto[]>(this.apiUrl, { params });
 }
 verUno(id: number): Observable<Producto> {
 return this.http.get<Producto>(`${this.apiUrl}/${id}`);
 }
 crear(producto: Partial<Producto>): Observable<any> {
 return this.http.post(this.apiUrl, producto);
 }
 editar(id: number, producto: Partial<Producto>): Observable<any> {
 return this.http.put(`${this.apiUrl}/${id}`, producto);
 }
 eliminar(id: number): Observable<any> {
 return this.http.delete(`${this.apiUrl}/${id}`);
 }
 subirImagen(archivo: File): Observable<{ imagen: string }> {
 const datos = new FormData();
 datos.append("imagen", archivo); // "imagen" = nombre del campo que lee PHP en $_FILES
 return this.http.post<{ imagen: string }>(`${this.apiUrl}/imagen`, datos);
 }
}
