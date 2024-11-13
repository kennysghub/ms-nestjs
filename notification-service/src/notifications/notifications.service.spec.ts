import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { Logger } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    loggerSpy = jest.spyOn(Logger.prototype, 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should log sending and sent messages', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      await service.sendWelcomeEmail(user);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Sending welcome email to ${user.email}`,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Welcome email sent successfully to ${user.email}`,
      );
    });

    it('should complete within reasonable time', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      const startTime = Date.now();
      await service.sendWelcomeEmail(user);
      const endTime = Date.now();

      // Should take around 1 second (simulation delay)
      expect(endTime - startTime).toBeLessThan(1500); // allowing 500ms buffer
      expect(endTime - startTime).toBeGreaterThan(900); // minimum 900ms
    });
  });
});
