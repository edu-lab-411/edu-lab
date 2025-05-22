import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SidebarComponent } from "./components/sidebar.component"
import { DashboardComponent } from "./components/dashboard.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, SidebarComponent, DashboardComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar></app-sidebar>
      <app-dashboard class="w-full"></app-dashboard>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  ],
})
export class AppComponent {
  title = "wessAcademy Admin"
}