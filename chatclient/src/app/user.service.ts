import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // Save user data in local storage
  saveUser(user: any) {
    localStorage.setItem(user.username, JSON.stringify(user));
  }

  // Retrieve user data from local storage
  getUser(username: string) {
    const userData = localStorage.getItem(username);
    return userData ? JSON.parse(userData) : null;
  }

  // Remove user data from local storage
  clearUser(username: string) {
    localStorage.removeItem(username);
  }

  // Get user profile picture from local storage
  getProfilePicture(username: string): string {
    const user = this.getUser(username); // Retrieve the user data
    return user?.profilePicture || 'default-picture-url.png';
  }
}
