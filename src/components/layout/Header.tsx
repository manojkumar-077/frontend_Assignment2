'use client';

import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

export function Header() {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b bg-background/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search bookmarks..."
                        className="pl-10 bg-accent/50 border-none focus-visible:ring-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button className="gap-2 hidden md:flex">
                    <Plus className="h-4 w-4" /> New Bookmark
                </Button>
                <div className="flex items-center gap-3 border-l pl-4 ml-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground lowercase">@{user?.username}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/20 border flex items-center justify-center overflow-hidden relative">
                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt={user.username}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <span className="text-xs font-bold">{user?.username?.[0].toUpperCase()}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
