import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  host: {
    class: 'fixed inset-0 z-50'
  },
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements AfterViewInit {
  hidePassword = true;
  
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  
  ngAfterViewInit() {
    this.createSparkles();
  }
  
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  private createSparkles(): void {
    const container = this.elementRef.nativeElement.querySelector('.sparkle-container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
      const sparkle = this.renderer.createElement('div');
      this.renderer.addClass(sparkle, 'sparkle');
      
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 8 + 2;
      const animationDuration = Math.random() * 2 + 1;
      const animationDelay = Math.random() * 2;
      
      this.renderer.setStyle(sparkle, 'left', `${left}%`);
      this.renderer.setStyle(sparkle, 'top', `${top}%`);
      this.renderer.setStyle(sparkle, 'width', `${size}px`);
      this.renderer.setStyle(sparkle, 'height', `${size}px`);
      this.renderer.setStyle(sparkle, 'animation-duration', `${animationDuration}s`);
      this.renderer.setStyle(sparkle, 'animation-delay', `${animationDelay}s`);
      
      this.renderer.appendChild(container, sparkle);
    }
  }
}
