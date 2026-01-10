import React from 'react';
import { Text } from '@ui-kitten/components';

import { ScreenContainer } from '@/components/ui';

export default function BudgetScreen() {
  return (
    <ScreenContainer centered>
      <Text category="h1">Budget</Text>
      <Text category="p1" appearance="hint">
        Gestisci il tuo budget
      </Text>
    </ScreenContainer>
  );
}
