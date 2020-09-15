import { TelegramService } from './TelegramService';
import { GoogleSpreadsheetService } from './GoogleSpreadsheetService';

export default {
  telegramService: new TelegramService(),
  googleSpreadsheetService: new GoogleSpreadsheetService()
};
