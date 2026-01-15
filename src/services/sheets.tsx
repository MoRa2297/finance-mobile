import { SheetDefinition, registerSheet } from 'react-native-actions-sheet';

import { CardTypeSelectSheet } from '@components/sheets/CardTypeSelectSheet/CardTypeSelectSheet';
import { BankAccountSelectSheet } from '@components/sheets/BankAccountSelectSheet/BankAccountSelectSheet';
import { PickerSheet } from '@components/sheets/PickerSheet/PickerSheet';
import { ColorSheet } from '@components/sheets/ColorSheet';
import { IconSheet } from '@components/sheets/IconSheet';
import { CategoryFormSheet } from '@components/sheets/CategoryFormSheet';
import { BankSelectSheet } from '@components/sheets/BankSelectSheet';
import { BankAccountTypeSheet } from '@components/sheets/BankAccountTypeSheet';
import { DatePickerSheet } from '@components/sheets/DatePickerSheet';

registerSheet('color-sheet', ColorSheet);
registerSheet('icon-sheet', IconSheet);
registerSheet('category-form-sheet', CategoryFormSheet);
registerSheet('bank-select-sheet', BankSelectSheet);
registerSheet('bank-account-type-sheet', BankAccountTypeSheet);
registerSheet('card-type-select-sheet', CardTypeSelectSheet);
registerSheet('bank-account-select-sheet', BankAccountSelectSheet);
registerSheet('picker-sheet', PickerSheet);
registerSheet('date-picker-sheet', DatePickerSheet);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'color-sheet': SheetDefinition<{
      payload: { selected: string };
      returnValue: { color: string };
    }>;
    'icon-sheet': SheetDefinition<{
      payload: { selected: string; selectedColor: string };
      returnValue: { icon: string };
    }>;
    'category-form-sheet': SheetDefinition<{
      payload: { category: any | null; type: 'income' | 'expenses' };
    }>;
    'bank-select-sheet': SheetDefinition<{
      returnValue: { bank: any };
    }>;
    'bank-account-type-sheet': SheetDefinition<{
      returnValue: { accountType: any };
    }>;
    'card-type-select-sheet': SheetDefinition<{
      returnValue: { cardType: any };
    }>;
    'bank-account-select-sheet': SheetDefinition<{
      returnValue: { bankAccount: any };
    }>;
    'picker-sheet': SheetDefinition<{
      payload: { data: { id: number; name?: string; value?: number }[] };
      returnValue: { item: number };
    }>;
    'date-picker-sheet': SheetDefinition<{
      payload: { day: string; month: string; year: string };
      returnValue: { day: string; month: string; year: string };
    }>;
  }
}

export {};
