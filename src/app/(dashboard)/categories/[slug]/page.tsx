'use client';

import { useState, useEffect, use } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Star, MoreVertical, ExternalLink, ArrowLeft, AlertCircle, BookX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, ProductsResponse } from '@/types';
import { motion } from 'framer-motion';

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const { slug } = use(params);
    const [bookmarks, setBookmarks] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategoryProducts() {
            try {
                const data = await api.get<ProductsResponse>(`/products/category/${slug}`);
                setBookmarks(data.products);
            } catch (error) {
                console.error('Failed to fetch category products', error);
                setError('Failed to load bookmarks. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchCategoryProducts();
    }, [slug]);

    const filteredBookmarks = bookmarks.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h3 className="text-xl font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-accent">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight capitalize">{slug.replace('-', ' ')}</h2>
                    <p className="text-muted-foreground">{filteredBookmarks.length} bookmarks found</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search in this category..."
                    className="pl-9 bg-card/50 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                {filteredBookmarks.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.05 }}
                        className="grid gap-4"
                    >
                        {filteredBookmarks.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden hover:bg-accent/40 transition-all border-border/50 bg-card/50 backdrop-blur-sm group">
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-6 items-center">
                                        <div className="h-24 w-32 flex-shrink-0 bg-white rounded-md border p-2 relative shadow-sm overflow-hidden group-hover:shadow-md transition-shadow">
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

                                        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg truncate pr-4 text-primary group-hover:text-primary/80 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    {item.rating && (
                                                        <div className="flex items-center justify-center sm:justify-start text-yellow-500 text-xs font-bold gap-1 mt-1">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {item.rating}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 justify-center sm:justify-end">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 max-w-3xl">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="w-full sm:w-auto flex justify-center">
                                            <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto hover:border-primary/50 hover:bg-primary/5" asChild>
                                                <a href={`https://dummyjson.com/products/${item.id}`} target="_blank" rel="noopener noreferrer">
                                                    Visit <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border/50 rounded-lg bg-card/30"
                    >
                        <BookX className="h-12 w-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No bookmarks found</h3>
                        <p className="text-sm">Try adjusting your search terms.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
