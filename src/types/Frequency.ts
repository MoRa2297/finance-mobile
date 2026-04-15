export const FrequencyTypes = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  BIMONTHLY: 'BIMONTHLY',
  QUARTERLY: 'QUARTERLY',
  SEMIANNUAL: 'SEMIANNUAL',
  YEARLY: 'YEARLY',
} as const;

export type Frequency = (typeof FrequencyTypes)[keyof typeof FrequencyTypes];
