import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/lib/theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { router } from './router';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: (count, error) => { const status = error && typeof error === 'object' && 'status' in error ? Number((error as { status: unknown }).status) : 0; return count < 2 && ![401, 403, 404].includes(status); } } } });
export default function App() {
  return <ThemeProvider><QueryClientProvider client={queryClient}><TooltipProvider><RouterProvider router={router} /></TooltipProvider><Toaster richColors position="bottom-right" />{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}</QueryClientProvider></ThemeProvider>;
}
