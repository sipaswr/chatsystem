import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Socket } from 'socket.io-client';
import { UserService } from '../user.service'; // Import UserService to access user profile picture

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ChatComponent implements OnInit {
  private socket!: Socket;
  currentGroup: string = '';
  messagecontent: string = "";
  messagecontents: { user: string; content: string; isImage?: boolean; profilePicture?: string | ArrayBuffer | null }[] = []; // Add profilePicture property
  channels: string[] = ['channel1', 'channel2'];
  currentUser: string = '';
  channelslist: string = "";
  channelnotice: string = "";
  channelJoinedMessage: string = "";
  currentchannel: string = "";
  isinChannel = false;
  newchannel: string = "";
  numusers: number = 0;
  selectedFile: File | null = null;

  constructor(private socketService: SocketService, private userService: UserService) {} // Inject UserService

  ngOnInit() {
    this.currentGroup = sessionStorage.getItem('currentGroup') || 'No Group Selected';
    this.currentUser = sessionStorage.getItem('username') || '';

    this.socketService.initSocket();
    this.socketService.getMessage((m: any) => {
      this.messagecontents.push(m);
    });

    this.socketService.reqchannellist();
    this.socketService.getchannellist((msg: any) => {
      this.channels = JSON.parse(msg);
    });

    this.socketService.notice((msg: any) => {
      this.channelnotice = msg;
    });

    this.socketService.joined((msg: any) => {
      this.currentchannel = msg;
      this.isinChannel = this.currentchannel !== "";
      this.channelJoinedMessage = `You have joined the channel: ${this.currentchannel}`;
    });
  }

  joinchannel() {
    if (this.channelslist) {
      this.socketService.joinchannel(this.channelslist);
      this.socketService.reqnumusers(this.channelslist);
      this.socketService.getnumusers((res: any) => { 
        this.numusers = res;
      });
      this.isinChannel = true;
    } else {
      console.error('No channel selected');
    }
  }

  leavechannel() {
    this.socketService.leavechannel(this.currentchannel);
    this.channelslist = "";
    this.currentchannel = "";
    this.isinChannel = false;
    this.channelJoinedMessage = ""; 
    this.messagecontents = [];
  }

  createchannel() {
    if (this.newchannel) {
      this.socketService.createchannel(this.newchannel);
      this.newchannel = ""; 

      // Fetch updated channel list
      this.socketService.reqchannellist();
      this.socketService.getchannellist((msg: any) => {
        this.channels = JSON.parse(msg);
      });
    } else {
      console.error('No channel name provided');
    }
  }

  chat(message: string, user: string, channel: string) {
    if (message) {
      const profilePicture = sessionStorage.getItem('profilePicture') || ''; // Retrieve profile picture from session storage
      this.socketService.sendMessage(message, user, channel);
      
      // Include the profile picture regardless of the message type (image or text)
      this.messagecontents.push({ 
        user: user, 
        content: message, 
        isImage: false, 
        profilePicture 
      });
      
      this.messagecontent = ""; 
    } else {
      console.log('No Message');
    }
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.uploadFile();
    }
  }

  // Upload the selected image
  uploadFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        const profilePicture = sessionStorage.getItem('profilePicture') || ''; // Get profile picture from session storage
  
        // Send as an image message along with the profile picture
        this.socketService.sendMessage(imageUrl, this.currentUser, this.currentchannel, true);
        this.messagecontents.push({
          user: this.currentUser,
          content: imageUrl,
          isImage: true,
          profilePicture // Add profile picture here for images
        });
      };
      reader.readAsDataURL(this.selectedFile);
      this.selectedFile = null; // Reset the selected file
    }
  }

  clearnotice() {
    this.channelnotice = "";
    this.channelJoinedMessage = "";
  }

  getActiveUsersText() {
    return `${this.numusers} Active User${this.numusers !== 1 ? 's' : ''}`;
  }
}
