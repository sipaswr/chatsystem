import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { SocketService } from '../services/socket.service';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const mockSocketService = {
  initSocket: jasmine.createSpy('initSocket'),
  getMessage: jasmine.createSpy('getMessage').and.returnValue(of({ user: 'TestUser', content: 'Test Message' })),
  reqchannellist: jasmine.createSpy('reqchannellist'),
  getchannellist: jasmine.createSpy('getchannellist').and.returnValue(of(['channel1', 'channel2'])),
  notice: jasmine.createSpy('notice').and.returnValue(of('Test Notice')),
  joined: jasmine.createSpy('joined').and.returnValue(of('Test Channel')),
  sendMessage: jasmine.createSpy('sendMessage'),
  joinchannel: jasmine.createSpy('joinchannel'),
  leavechannel: jasmine.createSpy('leavechannel'),
  reqnumusers: jasmine.createSpy('reqnumusers'),
  getnumusers: jasmine.createSpy('getnumusers').and.returnValue(of(1)),
  createchannel: jasmine.createSpy('createchannel'),
};

const mockUserService = {
  getUser: jasmine.createSpy('getUser').and.returnValue({ username: 'TestUser', profilePicture: 'testpic.jpg' })
};

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: SocketService, useValue: mockSocketService },
        { provide: UserService, useValue: mockUserService }
      ],
      imports: [FormsModule, CommonModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current group and user', () => {
    sessionStorage.setItem('currentGroup', 'TestGroup');
    sessionStorage.setItem('username', 'TestUser');
    component.ngOnInit();
    expect(component.currentGroup).toBe('TestGroup');
    expect(component.currentUser).toBe('TestUser');
  });

  it('should join a channel', () => {
    component.channelslist = 'channel1';
    component.joinchannel();
    expect(mockSocketService.joinchannel).toHaveBeenCalledWith('channel1');
    expect(mockSocketService.reqnumusers).toHaveBeenCalledWith('channel1');
  });

  it('should leave a channel', () => {
    component.currentchannel = 'Test Channel';
    component.isinChannel = true;
    component.leavechannel();
    expect(mockSocketService.leavechannel).toHaveBeenCalledWith('Test Channel');
    expect(component.isinChannel).toBe(false);
    expect(component.messagecontents.length).toBe(0);
  });

  it('should create a new channel', () => {
    component.newchannel = 'newchannel';
    component.createchannel();
    expect(mockSocketService.createchannel).toHaveBeenCalledWith('newchannel');
    expect(component.newchannel).toBe(''); // Resets the new channel input
  });

  it('should send a chat message', () => {
    const testMessage = 'Hello World';
    component.messagecontent = testMessage;
    component.chat(testMessage, 'TestUser', 'channel1');
    expect(mockSocketService.sendMessage).toHaveBeenCalledWith(testMessage, 'TestUser', 'channel1');
    expect(component.messagecontents.length).toBeGreaterThan(0); // Message added to the list
  });

  it('should display a profile picture in chat messages', () => {
    sessionStorage.setItem('profilePicture', 'testpic.jpg');
    const testMessage = 'Hello with Picture';
    component.chat(testMessage, 'TestUser', 'channel1');
    expect(component.messagecontents[0].profilePicture).toBe('testpic.jpg');
  });

  it('should upload an image file', () => {
    const file = new File(['test image'], 'test-image.png', { type: 'image/png' });
    spyOn(component, 'uploadFile').and.callThrough();
    
    const fileChangeEvent = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(fileChangeEvent);
    
    expect(component.uploadFile).toHaveBeenCalled();
  });
});
