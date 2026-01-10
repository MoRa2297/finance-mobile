import React from 'react';
import { Text } from '@ui-kitten/components';

import { ScreenContainer } from '@/components/ui';

export default function ExpensesScreen() {
  return (
    <ScreenContainer centered>
      <Text category="h1">Spese</Text>
      <Text category="p1" appearance="hint">
        Le tue transazioni
      </Text>
    </ScreenContainer>
  );
}
