import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminDashboardComponent } from './group-admin-dashboard.component';

describe('GroupAdminDashboardComponent', () => {
  let component: GroupAdminDashboardComponent;
  let fixture: ComponentFixture<GroupAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupAdminDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
