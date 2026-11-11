import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CompraService } from "../../servicios/compra";
@Component({ selector: "app-compras", imports: [RouterLink], templateUrl:
"./compras.html" })
export class ComprasComponent implements OnInit {
 compras: any[] = [];
 constructor(private compraService: CompraService) {}
 ngOnInit(): void {
 this.compraService.historial().subscribe(lista => (this.compras = lista));
 }
}
