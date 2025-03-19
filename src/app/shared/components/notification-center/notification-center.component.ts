import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative notification-center">
      <button (click)="toggleDropdown()" class="relative p-2">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span *ngIf="unreadCount$ | async as count" 
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {{ count }}
        </span>
      </button>

      <div *ngIf="isOpen" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Notifications</h3>
            <button (click)="markAllAsRead()" class="text-sm text-blue-600 hover:text-blue-800">
              Mark all as read
            </button>
          </div>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div *ngFor="let notification of notifications$ | async" 
               class="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
               [ngClass]="{'bg-blue-50 dark:bg-blue-900': !notification.read}">
            <div class="flex items-start">
              <span class="text-xl mr-3">{{ notification.icon }}</span>
              <div class="flex-1">
                <h4 class="text-sm font-medium">{{ notification.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ notification.message }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ notification.timestamp | date:'short' }}
                </p>
              </div>
              <button (click)="removeNotification(notification.id)" 
                      class="ml-4 text-gray-400 hover:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div *ngIf="(notifications$ | async)?.length === 0" 
               class="p-4 text-center text-gray-500">
            No notifications
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button (click)="clearNotifications()" 
                  class="text-sm text-red-600 hover:text-red-800">
            Clear all notifications
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationCenterComponent implements OnInit {
  isOpen = false;
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  isDarkMode$: Observable<boolean>;

  constructor(
    private notificationService: NotificationService,
    private themeService: ThemeService
  ) {
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.unreadCount$;
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit() {
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-center')) {
        this.isOpen = false;
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.isOpen = false;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
  }
} 