import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: 'achievement' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  icon?: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.read).length)
  );

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications() {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const notifications = JSON.parse(storedNotifications).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
      this.notificationsSubject.next(notifications);
    }
  }

  private saveNotifications(notifications: Notification[]) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    this.notificationsSubject.next(notifications);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.saveNotifications([newNotification, ...currentNotifications]);
  }

  markAsRead(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    this.saveNotifications(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.saveNotifications(updatedNotifications);
  }

  clearNotifications(): void {
    this.saveNotifications([]);
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.saveNotifications(updatedNotifications);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Helper methods for common notification types
  showAchievement(title: string, message: string, icon: string): void {
    this.addNotification({
      type: 'achievement',
      title,
      message,
      icon
    });
  }

  showSuccess(title: string, message: string): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      icon: '✅'
    });
  }

  showError(title: string, message: string): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      icon: '❌'
    });
  }

  showWarning(title: string, message: string): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      icon: '⚠️'
    });
  }

  showInfo(title: string, message: string): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      icon: 'ℹ️'
    });
  }
} 