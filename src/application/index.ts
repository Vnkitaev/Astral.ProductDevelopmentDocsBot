import { ApplicationCommands } from './commands';

import services from '../services';

export class Application {
  private commands: ApplicationCommands;

  constructor() {
    this.commands = new ApplicationCommands(services);
  }

  public async bootstrap() {
    const bot = services.telegramService.create('1396690722:AAFzLTQ07apHceWyelUwCRXkuKmNdwvC1PM');

    await this.commands.init(bot);

    this.commands.subscribe(bot);

    bot.launch()
      .then(() => console.log('Bot started'))
      .catch(console.error);
  }
}
