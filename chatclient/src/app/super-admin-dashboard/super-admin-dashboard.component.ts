import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent {
  listUsers = [
    { username: 'super', password: '123', role: 'super' },
    { username: 'user', password: 'user123', role: 'user' },
    { username: 'groupadmin', password: 'group123', role: 'groupadmin' }
  ];

  constructor(private router: Router) { }
  

  // Promote user to Group Admin
  promoteToGroupAdmin(username: string) {
    const user = this.listUsers.find(u => u.username === username);
    if (user && user.role !== 'super') {
      user.role = 'groupadmin';
      alert(`${username} has been promoted to Group Admin.`);
    } else {
      alert('Cannot promote this user to Group Admin.');
    }
  }

  // Remove a user from the system
  removeUser(username: string) {
    const index = this.listUsers.findIndex(u => u.username === username);
    if (index !== -1) {
      this.listUsers.splice(index, 1);
      alert(`${username} has been removed.`);
    } else {
      alert('User not found.');
    }
  }

  // Upgrade a user to Super Admin
  upgradeToSuperAdmin(username: string) {
    const user = this.listUsers.find(u => u.username === username);
    if (user && user.role !== 'super') {
      user.role = 'super';
      alert(`${username} has been upgraded to Super Admin.`);
    } else {
      alert('Cannot upgrade this user to Super Admin.');
    }
  }

  // Log out functionality
  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
