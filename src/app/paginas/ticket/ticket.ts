import { Component, OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TicketService } from "../../servicios/ticket";

@Component({
  selector: "app-ticket",
  imports: [RouterLink],
  templateUrl: "./ticket.html",
  styleUrl: "./ticket.css"
})
export class TicketComponent implements OnInit {

  ticket = signal<any>(null);   // datos del ticket (null mientras carga)
  urlPdf = signal("");          // link completo para abrir el PDF
  error = signal("");

  constructor(
    private ruta: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    // Lee el ":id" de la ruta /paginas/ticket/:id
    const id = Number(this.ruta.snapshot.paramMap.get("id"));

    this.ticketService.ver(id).subscribe({
      next: (t) => {
        this.ticket.set(t);
        // pdf_path viene de la base: le sumamos la URL base sin duplicar "/"
        const ruta = String(t.pdf_path ?? "").replace(/^\/+/, "");
        this.urlPdf.set(this.ticketService.baseArchivos + ruta);
      },
      error: (err) => {
        console.error("Error al cargar el ticket:", err);
        this.error.set("No se pudo cargar el ticket.");
      }
    });
  }
}