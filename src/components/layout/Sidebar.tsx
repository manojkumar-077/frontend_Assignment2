'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home,
    Grid,
    Zap,
    Compass,
    Settings,
    Plus,
    LogOut,
    Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const navItems = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Categories', href: '/categories', icon: Grid },
    { name: 'Frequent', href: '/frequent', icon: Zap },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Add Bookmark', href: '/add-bookmark', icon: Plus },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-16 items-center px-6 border-b">
                <Bookmark className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">Markflow</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </Button>
            </div>
        </div>
    );
}
