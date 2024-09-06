import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './group-admin-dashboard.component.html',
  styleUrls: ['./group-admin-dashboard.component.css']
})
export class GroupAdminDashboardComponent {
  userToBan: string = '';
  channelToBanFrom: string = '';
  selectedGroupForBan: string = '';

  newGroupName: string = '';
  newChannelName: string = '';
  selectedGroupForChannel: string = '';
  groupToRemove: string = '';
  channelToRemove: string = '';
  selectedGroupForChannelRemoval: string = '';
  userToDelete: string = '';
  selectedGroupForUserDeletion: string = '';
  oldGroupName: string = '';

  listUsers = [
    { username: 'super', password: '123', role: 'super' },
    { username: 'user', password: 'user123', role: 'user' },
    { username: 'groupadmin', password: 'group123', role: 'groupadmin' }
  ];

  // Assuming a single group admin controls multiple groups
  myGroups = [
    {
      name: 'Group1',
      channels: [
        { name: 'Channel1' },
        { name: 'Channel2' }
      ],
      users: ['user']
    }
  ];

  constructor(private router: Router) { }

  // Create a new group
  createGroup(groupName: string) {
    if (groupName) {
      this.myGroups.push({ name: groupName, channels: [], users: [] });
      alert(`Group "${groupName}" has been created.`);
    } else {
      alert('Group name is required.');
    }
  }

  // Create a new channel within a group
  createChannel(channelName: string, groupName: string) {
    const group = this.myGroups.find(g => g.name === groupName);
    if (group) {
      group.channels.push({ name: channelName });
      alert(`Channel "${channelName}" has been created in group "${groupName}".`);
    } else {
      alert('Group not found.');
    }
  }

  // Remove a group
  removeGroup(groupName: string) {
    const index = this.myGroups.findIndex(g => g.name === groupName);
    if (index !== -1) {
      this.myGroups.splice(index, 1);
      alert(`Group "${groupName}" has been removed.`);
    } else {
      alert('Group not found.');
    }
  }

  // Remove a channel from a group
  removeChannel(channelName: string, groupName: string) {
    const group = this.myGroups.find(g => g.name === groupName);
    if (group) {
      const index = group.channels.findIndex(c => c.name === channelName);
      if (index !== -1) {
        group.channels.splice(index, 1);
        alert(`Channel "${channelName}" has been removed from group "${groupName}".`);
      } else {
        alert('Channel not found.');
      }
    } else {
      alert('Group not found.');
    }
  }

  // Delete a user from a group
  deleteUserFromGroup(username: string, groupName: string) {
    const group = this.myGroups.find(g => g.name === groupName);
    if (group) {
      const index = group.users.indexOf(username);
      if (index !== -1) {
        group.users.splice(index, 1);
        alert(`User "${username}" has been removed from group "${groupName}".`);
      } else {
        alert('User not found in this group.');
      }
    } else {
      alert('Group not found.');
    }
  }

  // Modify or delete a group that the admin created
  modifyGroup(oldGroupName: string, newGroupName: string) {
    const group = this.myGroups.find(g => g.name === oldGroupName);
    if (group) {
      group.name = newGroupName;
      alert(`Group "${oldGroupName}" has been renamed to "${newGroupName}".`);
    } else {
      alert('Group not found.');
    }
  }

  // Ban a user from a channel
  banUserFromChannel(userName: string, channelName: string, groupName: string) {
    const group = this.myGroups.find(g => g.name === groupName);
    if (group) {
      const channel = group.channels.find(c => c.name === channelName);
      if (channel) {
        alert(`User "${userName}" has been banned from channel "${channelName}" in group "${groupName}".`);
        this.reportToSuperAdmin(userName, channelName, groupName);
      } else {
        alert('Channel not found.');
      }
    } else {
      alert('Group not found.');
    }
  }

  // Report banned user to super admin
  reportToSuperAdmin(userName: string, channelName: string, groupName: string) {
    alert(`Reported banning of user "${userName}" from channel "${channelName}" in group "${groupName}" to Super Admin.`);
  }

  // Log out 
  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
