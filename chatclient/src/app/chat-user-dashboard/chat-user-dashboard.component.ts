import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-user-dashboard.component.html',
  styleUrls: ['./chat-user-dashboard.component.css']
})
export class ChatUserDashboardComponent implements OnInit {
  username: string = ''; 
  groups: string[] = [];  // List of groups user belongs to
  interestedGroups: string[] = [];  // Groups user is interested in
  allGroups: string[] = ['Group A', 'Group B', 'Group C'];  // Example list of available groups

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || '';
    this.groups = JSON.parse(sessionStorage.getItem('groups') || '[]');
    this.interestedGroups = JSON.parse(sessionStorage.getItem('interestedGroups') || '[]');
  }

  // Create a new chat user
  createUser(newUsername: string) {
    if (newUsername && newUsername.trim()) {
      this.username = newUsername;
      sessionStorage.setItem('username', this.username);
    }
  }

  // Join a group by adding user to the group
  joinGroup(groupName: string) {
    if (!this.groups.includes(groupName)) {
      this.groups.push(groupName);
      sessionStorage.setItem('groups', JSON.stringify(this.groups));
    }
  }

  // Register interest in a group
  registerInterest(groupName: string) {
    if (!this.interestedGroups.includes(groupName)) {
      this.interestedGroups.push(groupName);
      sessionStorage.setItem('interestedGroups', JSON.stringify(this.interestedGroups));
    }
  }

  // Leave a group
  leaveGroup(groupName: string) {
    const index = this.groups.indexOf(groupName);
    if (index !== -1) {
      this.groups.splice(index, 1);
      sessionStorage.setItem('groups', JSON.stringify(this.groups));
    }
  }

  // Delete the user account
  deleteUser() {
    sessionStorage.clear();  // Clear all session data
    this.username = '';
    this.groups = [];
    this.interestedGroups = [];
    this.router.navigate(['/login']);  // Redirect to login page
  }

  // Logout user and clear session
  logout() {
    sessionStorage.clear();  // Clear session
    this.username = '';
    this.router.navigate(['/login']);  // Redirect to login page
  }
}
