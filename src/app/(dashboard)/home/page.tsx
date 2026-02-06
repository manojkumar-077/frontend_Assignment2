'use client';

import { useBookmarks } from '@/hooks/useBookmarks';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Trash2, Edit, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

import Image from 'next/image';

export default function HomePage() {
    const { bookmarks, loading, error, setBookmarks } = useBookmarks();

    const handleDelete = async (id: number) => {
        // Optimistic update
        setBookmarks(prev => prev.filter(b => b.id !== id));
        try {
            await api.delete(`/products/${id}`);
        } catch (err: unknown) {
            console.error('Failed to delete bookmark', err);
            // Revert if needed, but for prototype we just log
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-8 text-center">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Home</h2>
                    <p className="text-muted-foreground">Managed Bookmarks (Products)</p>
                </div>
            </div>

            <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
            >
                {bookmarks.map((bookmark) => (
                    <motion.div
                        key={bookmark.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group">
                            <div className="aspect-video w-full bg-muted relative p-4 flex items-center justify-center bg-white overflow-hidden">
                                {bookmark.thumbnail && (
                                    <motion.div
                                        className="relative w-full h-full"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Image
                                            src={bookmark.thumbnail}
                                            alt={bookmark.title}
                                            fill
                                            className="object-contain p-4"
                                            unoptimized
                                        />
                                    </motion.div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full capitalize backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                    {bookmark.category}
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-lg line-clamp-1" title={bookmark.title}>
                                        {bookmark.title}
                                    </CardTitle>
                                    {bookmark.rating && (
                                        <div className="flex items-center text-yellow-500 text-xs font-bold gap-1">
                                            <Star className="h-3 w-3 fill-current" />
                                            {bookmark.rating}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {bookmark.description}
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between gap-2 mt-auto">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1" asChild>
                                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" /> Visit
                                    </a>
                                </Button>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(bookmark.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
