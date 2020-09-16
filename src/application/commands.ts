import { map, uniq, filter, includes, sumBy } from 'lodash';
import { session, Markup } from 'telegraf';
import { rowsToUsers } from './utils';

enum FirstStepCommands {
  FotSum = 'step1_fot_sum',
  EmployeeSalary = 'step1_employee_salary',
  CheckoutProcessing = 'step1_checkout_processing'
}

export class ApplicationCommands {
  private readonly services: any;
  private users: any[];
  private readonly allowIds = [
    344347
  ];

  constructor(services) {
    this.services = services;

    this.firstStep = this.firstStep.bind(this);
    this.secondStep = this.secondStep.bind(this);
  }

  public async init(bot) {
    bot.use(session());
    bot.use(this.secureMiddleware);

    await this.updateUsers();
  }

  public subscribe(bot) {
    bot.command('start', this.start);
    bot.action(/^(step1).+/, this.firstStep);
    bot.action(/^(step2).+/, this.secondStep);
  }

  private async updateUsers() {
    const rows = await this.services.googleSpreadsheetService.getDocumentSheetRows('1Heedc2ZuE55ZM0qVwqx-5Yt8JZ4zICTFES1eetSUQ5g', 0);

    this.users = rowsToUsers(rows);
  }

  private async secureMiddleware(ctx, next) {
    if (includes(this.allowIds, ctx.from.id)) return next();

    return ctx.reply('Доступ запрещён');
  }

  private start(ctx: any) {
    return ctx.reply('Выберите что хотите сделать:', Markup.inlineKeyboard([
      [Markup.callbackButton('Узнать стоимость штата продукта', FirstStepCommands.FotSum)],
      [Markup.callbackButton('Узнать зарплату конкретного человека на продукте', FirstStepCommands.EmployeeSalary)],
      [Markup.callbackButton('Оформить переработки', FirstStepCommands.CheckoutProcessing)]
    ]).extra());
  }

  private async firstStep(ctx: any) {
    await this.updateUsers();

    const match = ctx.match[0];

    if (match === FirstStepCommands.FotSum) {
      const products = filter(uniq(map(this.users, user => user.project)), Boolean);

      return ctx.reply('Выберите продукт:', Markup.inlineKeyboard(
        map(products, (productName) => {
          // @ts-ignore
          return [Markup.callbackButton(productName, `step2_${productName}`)];
        })
      ).extra());
    } else if (match === FirstStepCommands.EmployeeSalary) {

    } else if (match === FirstStepCommands.CheckoutProcessing) {

    }
  }

  private async secondStep(ctx: any) {
    const match = ctx.match[0];
    const productName = match.split('_')[1];
    const employees = filter(this.users, { project: productName });
    const developers = filter(employees, { path: 'Разработка' });
    const employeesFullSalary = sumBy(employees, 'fullSalary');
    const employeesAccruals = sumBy(employees, 'accruals');

    const message = `Продукт: ${productName}
Количество человек общее: ${employees.length}
Количество человек в разработке: ${developers.length}
Количество человек в тестировании: ${employees.length - developers.length}
Сумма ФОТ грязными: ${employeesFullSalary} рублей
Сумма ФОТ с начислениями: ${employeesFullSalary + employeesAccruals} рублей
`;

    return ctx.reply(message);
  }
}
