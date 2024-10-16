import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  listUsers = [
    {username: 'super', password: '123', role: 'super' },
    {username: 'user', password: 'user123', role: 'user' },
    {username: 'groupadmin', password: 'group123', role: 'groupadmin'}
  ]

  username: string = '';
  password: string = '';
  role: string = '';
  errorMessage: string = '';


  constructor(private router: Router) { }

  login(){
    const user = this.listUsers.find(u => u.username === this.username && u.password === this.password);
    
    if (!this.username) {
      this.errorMessage = 'Username is required';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password is required';
      return;
    }

    if (user) {
      // Store user info in local storage
      localStorage.setItem('loggedInUser', user.username);
    
      switch (user.role) {
        case 'super':
          this.router.navigate(['/super-admin-dashboard']);
          break;
        case 'groupadmin':
          this.router.navigate(['/group-admin-dashboard']);
          break;
        case 'user':
          this.router.navigate(['/chat-user-dashboard']);
          break;
        default:
          this.errorMessage = 'Invalid role';
      }
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}

