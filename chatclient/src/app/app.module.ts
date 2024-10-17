import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { GroupAdminDashboardComponent } from './group-admin-dashboard/group-admin-dashboard.component';
import { ChatUserDashboardComponent } from './chat-user-dashboard/chat-user-dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { SocketService } from './services/socket.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginComponent,
    SuperAdminDashboardComponent,
    GroupAdminDashboardComponent,
    ChatUserDashboardComponent,
    ChatComponent,
    CommonModule,
    NavbarComponent
  ],
  exports: [
    SuperAdminDashboardComponent,
    GroupAdminDashboardComponent,
    ChatUserDashboardComponent
  ],
  providers: [SocketService],
})

export class AppModule { }
