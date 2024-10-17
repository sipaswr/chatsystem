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
  profilePicture: string | ArrayBuffer | null = null; // Property for the profile picture
  groups: string[] = [];  // List of groups user belongs to
  interestedGroups: string[] = [];  // Groups user is interested in
  allGroups: string[] = ['Group A', 'Group B', 'Group C'];  // Example list of available groups

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || '';
    this.groups = JSON.parse(sessionStorage.getItem('groups') || '[]');
    this.interestedGroups = JSON.parse(sessionStorage.getItem('interestedGroups') || '[]');
    this.profilePicture = sessionStorage.getItem('profilePicture') || null; // Load saved profile picture
  }

  // Create a new chat user
  createUser(newUsername: string) {
    if (newUsername && newUsername.trim()) {
      this.username = newUsername;
      sessionStorage.setItem('username', this.username);
    }
  }

  // Handle profile picture change
  onProfilePictureChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target?.result as string | ArrayBuffer; // Ensure result is a compatible type
        sessionStorage.setItem('profilePicture', this.profilePicture as string); // Save to session storage
      };
      reader.readAsDataURL(input.files[0]);
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

  // Navigate to chat page with the specific group
  startChat(groupName: string) {
    sessionStorage.setItem('currentGroup', groupName);
    this.router.navigate(['/chat']); 
  }

  // Delete the user account
  deleteUser() {
    sessionStorage.clear();  // Clear all session data
    this.username = '';
    this.groups = [];
    this.interestedGroups = [];
    this.profilePicture = null; // Clear profile picture
    this.router.navigate(['/login']);  // Redirect to login page
  }

  // Logout user and clear session
  logout() {
    sessionStorage.clear();  // Clear session
    this.username = '';
    this.profilePicture = null; // Clear profile picture
    this.router.navigate(['/login']);  // Redirect to login page
  }
}
