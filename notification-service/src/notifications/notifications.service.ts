import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendWelcomeEmail(user: any) {
    this.logger.log(`Sending welcome email to ${user.email}`);

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`Welcome email sent successfully to ${user.email}`);
  }
}
