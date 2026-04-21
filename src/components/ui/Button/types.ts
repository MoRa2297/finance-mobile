export type ButtonAppearance = 'filled' | 'outline' | 'ghost';

export type ButtonStatus =
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'neutral';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface VariantColors {
  bg: string;
  text: string;
  border: string;
  borderWidth: number;
}
