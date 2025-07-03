import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

export default function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 }, // 1분
          mutations: { retry: 2 }, // 2회 자동 재시도
        },
      })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
