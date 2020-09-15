import { map } from 'lodash';

export const parseMoney = (sum) => {
  if (sum === '#N/A') return 0;

  return parseInt(sum.replace(',00 ', '').replace(' р. ', '').replace(' ', ''), 10);
};

export const rowsToUsers = rows => {
  return map(rows, (r, i) => ({
    id: i,
    fullName: r[0],
    city: r[1],
    organization: r[2],
    department: r[3],
    path: r[4],
    profile: r[5],
    rate: r[6],
    salary: r[7],
    allowance: parseMoney(r[8]),
    additionalAllowance: parseMoney(r[9]),
    wage: r[10],
    fullSalary: parseMoney(r[11]),
    project: r[12],
    accruals: parseMoney(r[16]),
    level: r[17]
  }));
};
