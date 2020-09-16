import { map, uniq, filter, includes, sumBy } from 'lodash';
import { session, Markup } from 'telegraf';
import { rowsToUsers, formatPrice } from './utils';

enum FirstStepCommands {
  FotSum = 'step_1_fot_sum',
  EmployeeSalary = 'step_1_employee_salary',
  CheckoutProcessing = 'step_1_checkout_processing'
}

export class ApplicationCommands {
  private readonly services: any;
  private users: any[];
  private readonly allowIds = [
    344347, // Китаев
    114355276, // Глагольев
    198911419, // Овсиенко
    58083708, // Федячкин
    76979631, // Холопов
    250410681 // Кольцов
  ];

  constructor(services) {
    this.services = services;

    this.secureMiddleware = this.secureMiddleware.bind(this);
    this.firstStep = this.firstStep.bind(this);
    this.secondStep = this.secondStep.bind(this);
    this.thirdStep = this.thirdStep.bind(this);
  }

  public async init(bot) {
    bot.use(session());
    bot.use(this.secureMiddleware);

    await this.updateUsers();
  }

  public subscribe(bot) {
    bot.command('start', this.start);
    bot.action(/^(step_1_).+/, this.firstStep);
    bot.action(/^(step_2_).+/, this.secondStep);
    bot.action(/^(step_3_).+/, this.thirdStep);
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
    const products = filter(uniq(map(this.users, user => user.project)), Boolean);

    if (match === FirstStepCommands.FotSum) {
      return ctx.reply('Выберите продукт:', Markup.inlineKeyboard(
        map(products, (productName) => {
          // @ts-ignore
          return [Markup.callbackButton(productName, `step_2_1_${productName}`)];
        })
      ).extra());
    } else if (match === FirstStepCommands.EmployeeSalary) {
      return ctx.reply('Выберите продукт:', Markup.inlineKeyboard(
        map(products, (productName) => {
          // @ts-ignore
          return [Markup.callbackButton(productName, `step_2_2_${productName}`)];
        })
      ).extra());
    } else if (match === FirstStepCommands.CheckoutProcessing) {

    }
  }

  private async secondStep(ctx: any) {
    const match = ctx.match[0].split('_');
    const subStep = parseInt(match[2], 10);
    const productName = match[3];
    const employees = filter(this.users, { project: productName });

    if (subStep === 1) {
      const developers = filter(employees, { path: 'Разработка' });
      const employeesFullSalary = Math.round(sumBy(employees, 'fullSalary'));
      const employeesAccruals = Math.round(sumBy(employees, 'accruals'));

      const message = `🛠 Продукт: *${productName}*
👥 Количество человек общее: *${employees.length}*
👤 Количество человек в разработке: *${developers.length}*
👤 Количество человек в тестировании: *${employees.length - developers.length}*
💰 Сумма ФОТ грязными: *${formatPrice(employeesFullSalary)}*
💰 Сумма ФОТ с начислениями: *${formatPrice(employeesFullSalary + employeesAccruals)}*
`;

      await ctx.replyWithMarkdown(message);

      return this.start(ctx);
    } else if (subStep === 2) {
      return ctx.reply('Выберите сотрудника:', Markup.inlineKeyboard(
        map(employees, (employee, index) => {
          // @ts-ignore
          return [Markup.callbackButton(employee.fullName, `step_3_2_${productName}_${index}`)];
        })
      ).extra());
    }
  }

  private async thirdStep(ctx: any) {
    const match = ctx.match[0].split('_');
    const thirdStep = parseInt(match[2], 10);

    if (thirdStep === 2) {
      const productName = match[3];
      const userId = match[4];
      const employees = filter(this.users, { project: productName });
      const user = employees[userId];

      const message = `👤 Сотрудник: *${user.fullName}*
🚀 Грейд: *${user.level}*
💰 Зарплата грязными: *${formatPrice(user.fullSalary)}*
💰 Зарплата с начислениями: *${formatPrice(user.fullSalary + user.accruals)}*
`;

      await ctx.replyWithMarkdown(message);

      return this.start(ctx);
    }
  }
}
