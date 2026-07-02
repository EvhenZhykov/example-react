import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Glob import all pages so Vite includes them in the build manifest and Inertia can resolve components by name.
const pages = import.meta.glob('./pages/**/*.tsx');

// Ensure Vite includes certain pages in the build manifest by adding dynamic import hints.
// These imports are intentionally not awaited; they only ensure the files are discovered by Vite
// during the build step so `@vite([... 'resources/js/pages/{$page["component"]}.tsx'])` works.
void import('./pages/users/index.tsx');
void import('./pages/users/create.tsx');
void import('./pages/users/edit.tsx');
void import('./pages/users/logins.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        // name is the Inertia component name like 'users/index'
        const path = `./pages/${name}.tsx`;
        const importer = (pages as Record<string, () => Promise<any>>)[path];

        if (!importer) {
            throw new Error(`Page not found: ${name}`);
        }

        return importer();
    },
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
