'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Star, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Bookmark, Product, ProductsResponse } from '@/types';
import { motion } from 'framer-motion';

interface FrequentBookmark extends Bookmark {
    visitCount: number;
}

export default function FrequentPage() {
    const [bookmarks, setBookmarks] = useState<FrequentBookmark[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFrequentBookmarks() {
            try {
                // Fetch a larger set to sort
                const data = await api.get<ProductsResponse>('/products?limit=30');
                const mapped = data.products.map((p: Product) => ({
                    id: p.id,
                    title: p.title,
                    url: `https://dummyjson.com/products/${p.id}`,
                    category: p.category,
                    thumbnail: p.thumbnail,
                    userId: 0,
                    description: p.description,
                    rating: p.rating,
                    // Simulate random visit count for demo purposes
                    visitCount: Math.floor(Math.random() * 500) + 50
                }));

                // Sort by visit count descending to simulate "Frequent"
                const sorted = mapped.sort((a, b) => b.visitCount - a.visitCount).slice(0, 15);
                setBookmarks(sorted);
            } catch (error) {
                console.error('Failed to fetch frequent bookmarks', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFrequentBookmarks();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Frequent Bookmarks</h2>
                <p className="text-muted-foreground">Your most visited sites and top picks.</p>
            </div>

            <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
            >
                {bookmarks.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="hover:bg-accent/40 transition-all border-l-4 border-l-primary/60 bg-card/50 backdrop-blur-sm group">
                            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                                <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 flex items-center justify-center font-bold text-2xl text-muted-foreground/20">
                                    #{index + 1}
                                </div>

                                <div className="h-20 w-32 flex-shrink-0 bg-white rounded-md border p-2 relative shadow-sm overflow-hidden group-hover:shadow-md transition-shadow">
                                    {item.thumbnail && (
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            className="object-contain p-1 transform transition-transform group-hover:scale-105"
                                            unoptimized
                                        />
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                                        <h3 className="text-xl font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-medium">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                            {item.rating}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-medium">
                                        <div className="flex items-center gap-1 text-primary">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                            <span>{item.visitCount} visits</span>
                                        </div>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="text-muted-foreground capitalize">{item.category}</span>
                                    </div>
                                </div>

                                <Button size="lg" className="flex-shrink-0 w-full sm:w-auto shadow-sm" asChild>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        Visit <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
