import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="w-full">
      <router-outlet />
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
    }
    
    ::ng-deep .p-button-indigo {
      color: #6366f1;
      border-color: #6366f1;
    }
    
    ::ng-deep .p-button-indigo:hover {
      background: rgba(99, 102, 241, 0.04);
      border-color: #4f46e5;
      color: #4f46e5;
    }
    
    ::ng-deep .p-dropdown-sm .p-dropdown {
      height: 38px;
    }
    
    ::ng-deep .p-card {
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    
    ::ng-deep .p-card .p-card-content {
      padding: 0;
    }
  `,
  ],
})
export class DashboardComponent {}
