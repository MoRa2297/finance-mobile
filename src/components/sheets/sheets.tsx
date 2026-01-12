import { SheetDefinition, registerSheet } from 'react-native-actions-sheet';
import { ColorSheet } from './ColorSheet';
import { IconSheet } from './IconSheet';
import { CategoryFormSheet } from './CategoryFormSheet';
import { BankSelectSheet } from './BankSelectSheet';
import { BankAccountTypeSheet } from './BankAccountTypeSheet';

registerSheet('color-sheet', ColorSheet);
registerSheet('icon-sheet', IconSheet);
registerSheet('category-form-sheet', CategoryFormSheet);
registerSheet('bank-select-sheet', BankSelectSheet);
registerSheet('bank-account-type-sheet', BankAccountTypeSheet);

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
  }
}

export {};
