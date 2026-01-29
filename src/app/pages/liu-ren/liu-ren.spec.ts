import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiuRen } from './liu-ren';

describe('LiuRen', () => {
  let component: LiuRen;
  let fixture: ComponentFixture<LiuRen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiuRen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiuRen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
