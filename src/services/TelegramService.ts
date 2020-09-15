import { Telegraf } from 'telegraf';

export class TelegramService {
  private bot;

  public create(token: string, options?: any) {
    this.bot = new Telegraf(token, options);

    return this.bot;
  }
}
