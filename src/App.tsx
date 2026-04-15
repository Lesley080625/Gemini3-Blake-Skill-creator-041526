/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider } from './contexts/AppContext';
import { BentoDashboard } from './components/BentoDashboard';

export default function App() {
  return (
    <AppProvider>
      <BentoDashboard />
    </AppProvider>
  );
}
