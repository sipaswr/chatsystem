import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserDashboardComponent } from './chat-user-dashboard.component';

describe('ChatUserDashboardComponent', () => {
  let component: ChatUserDashboardComponent;
  let fixture: ComponentFixture<ChatUserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatUserDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
