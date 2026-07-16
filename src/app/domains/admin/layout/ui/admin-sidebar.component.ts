import { Component } from '@angular/core';
import { Navigation } from '@/app/domains/admin/layout/ui/navigation.component';
import { Notifications } from '@/app/domains/admin/layout/ui/notifications.component';
import { User } from '@/app/domains/admin/layout/ui/user.component';

@Component({
  selector: 'admin-sidebar',
  imports: [Navigation, Notifications, User],
  host: {
    class: 'flex w-full flex-auto flex-col',
  },
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebar {}
