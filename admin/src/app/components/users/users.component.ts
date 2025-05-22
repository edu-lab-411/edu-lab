import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UsersApiService } from '../../services/users-api.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,Toast],
  templateUrl: "./users.component.html",
  providers: [MessageService],
})
export class UsersComponent {
  users: any[] = [];

  constructor(
    private userAPI: UsersApiService,
    private messageService: MessageService
  ) {};

  ngOnInit() {
    this.userAPI.getUsers().subscribe((data: any) => {
      this.users = data;
      // console.log(this.users);
    });
  }

  blockUser(userId: number) {
    this.userAPI.blockUser(userId).subscribe({
      next: data => {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex].blocked = true;
        }
        // console.log(`User with ID ${userId} blocked`);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Blocked successfully' });
      },
      error: error => {
        console.error('Error blocking user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to block user' });
      }
    });
  }
  
  unBlocked(userId: number) {
    this.userAPI.unblockUser(userId).subscribe({
      next: data => {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex].blocked = false;
        }
        // console.log(`User with ID ${userId} unblocked`);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Unblocked successfully' });
      },
      error: error => {
        console.error('Error unblocking user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to unblock user' });
      }
    });
  }
}
