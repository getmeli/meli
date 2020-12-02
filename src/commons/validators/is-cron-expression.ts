import cron from 'cron-parser';

export function isCronExpression(expression: string) {
  try {
    cron.parseExpression(expression);
  } catch (e) {
    throw new Error('value is an invalid cron expression');
  }
  return expression;
}
