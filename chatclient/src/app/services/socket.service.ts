import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000/chat';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() {}

  initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  joinchannel(selchannel: string): void {
    this.socket.emit("joinChannel", selchannel);
  }

  leavechannel(channel: string): void {
    this.socket.emit('leave-channel', channel);
  }

  joined(next: (res: any) => void): void {
    this.socket.on("joined", (res: any) => next(res));
  }

  left(next: (res: any) => void): void {
    this.socket.on("left", (res: any) => next(res));
  }

  createchannel(newchannel: string): void {
    this.socket.emit('newchannel', newchannel);
  }

  reqnumusers(selchannel: string): void {
    this.socket.emit("numusers", selchannel);
  }

  getnumusers(next: (res: any) => void): void {
    this.socket.on('numusers', (res: any) => next(res));
  }

  reqchannellist(): void {
    this.socket.emit('channellist', 'list please');
  }

  getchannellist(next: (res: any) => void): void {
    this.socket.on('channellist', (res: any) => next(res));
  }

  notice(next: (res: any) => void): void {
    this.socket.on('notice', (res: any) => next(res));
  }

  sendMessage(message: string, username: string, channel: string, isImage: boolean = false): void {
    this.socket.emit('message', { channel, message, username, isImage });
  }

  getMessage(next: (message: any) => void): void {
    this.socket.on('message', (message: any) => next(message));
  }
}
