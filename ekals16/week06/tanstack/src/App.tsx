import './App.css'
import type React from 'react';
import { WelcomeData } from './components/UserDataDisplay';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  );
};

export default App
