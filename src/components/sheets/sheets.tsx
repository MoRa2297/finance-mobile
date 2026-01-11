import { SheetDefinition, registerSheet } from 'react-native-actions-sheet';
import { ColorSheet } from './ColorSheet';
import { IconSheet } from './IconSheet';
import { CategoryFormSheet } from './CategoryFormSheet';

registerSheet('color-sheet', ColorSheet);
registerSheet('icon-sheet', IconSheet);
registerSheet('category-form-sheet', CategoryFormSheet);

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
  }
}

// export const Sheets = () => {
//   return (
//     <SheetRegister
//       sheets={{
//         'color-sheet': ColorSheet,
//         'icon-sheet': IconSheet,
//         'category-form-sheet': CategoryFormSheet,
//       }}
//     />
//   );
// };
