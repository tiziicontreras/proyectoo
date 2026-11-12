import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CompraService } from "../../servicios/compra";

@Component({
  selector: "app-compras",
  imports: [RouterLink],
  templateUrl: "./compras.html",
  styleUrl: "./compras.css"
})
export class ComprasComponent implements OnInit {

  compras: any[] = [];

  constructor(private compraService: CompraService) {}

  ngOnInit(): void {
    this.compraService.historial().subscribe(lista => (this.compras = lista));
  }

  // El total llega como texto ("209999.00"): lo mostramos como $209.999
  formatoTotal(total: any): string {
    return Number(total).toLocaleString("es-AR");
  }

  // "2026-11-11 23:17:23" -> "11/11/2026 · 23:17"
  formatoFecha(fecha: string): string {
    const [dia, hora] = String(fecha).split(" ");
    const [anio, mes, d] = (dia ?? "").split("-");
    if (!anio || !mes || !d) return fecha;
    return `${d}/${mes}/${anio}` + (hora ? ` · ${hora.slice(0, 5)}` : "");
  }
}