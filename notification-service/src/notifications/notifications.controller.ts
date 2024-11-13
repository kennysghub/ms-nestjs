import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('user_created')
  async handleUserCreated(user: any) {
    this.logger.log(`Received user_created event for user: ${user.email}`);
    await this.notificationsService.sendWelcomeEmail(user);
  }
}
