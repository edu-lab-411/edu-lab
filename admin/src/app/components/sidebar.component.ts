import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="w-64 bg-white shadow-lg z-10 flex flex-col h-screen">
      <div class="p-4 border-b border-gray-100">
          <img src="logo.png" alt="Logo" class="object-contain w-[145px]">
      </div>

      <div class="flex-1 p-4">
        <nav class="space-y-3 mt-4">
          <a 
            *ngFor="let item of navItems" 
            [routerLink]="item.route" 
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
          >
            <i class="mr-3 text-indigo-500" [ngClass]="item.icon"></i>
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </div>

      <div class="p-4 text-gray-400 text-sm text-center font-semibold">
        &copy; 2025 wessAcademy.
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }
  `],
})
export class SidebarComponent {
  navItems = [
    { label: "Overview", route: "/overview", icon: "fas fa-chart-pie" },
    { label: "Courses", route: "/courses", icon: "fas fa-chalkboard-user" },
    { label: "Users", route: "/users", icon: "fas fa-users" },
  ]
}
