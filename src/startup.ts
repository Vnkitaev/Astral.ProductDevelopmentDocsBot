import { Application } from './application';

const application = new Application();

(async () => {
  try {
    await application.bootstrap();
  } catch (e) {
    console.error(e);
  }
})();
