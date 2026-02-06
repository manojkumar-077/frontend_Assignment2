'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Bookmark, ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductsResponse } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Mapping user interest IDs to DummyJSON categories
const INTEREST_MAPPING: Record<string, string[]> = {
    'tech': ['laptops', 'tablets', 'smartphones', 'mobile-accessories'],
    'design': ['furniture', 'home-decoration', 'kitchen-accessories'],
    'ai': ['laptops', 'tablets'],
    'dev': ['laptops'],
    'music': ['mobile-accessories'],
    'finance': ['laptops', 'tablets'],
    'books': ['tablets'],
    'fitness': ['sports-accessories', 'mens-shoes', 'womens-shoes'],
    'travel': ['sunglasses', 'womens-bags', 'vehicle'],
    'gaming': ['laptops', 'smartphones'],
    'news': ['tablets'],
    'science': ['laptops'],
};

export default function ExploreFeedPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [interests, setInterests] = useState<string[]>([]);

    // Local state for interactions
    const [saved, setSaved] = useState<Set<number>>(new Set());
    const [liked, setLiked] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedInterests = localStorage.getItem('markflow_interests');
            if (savedInterests) {
                try {
                    setInterests(JSON.parse(savedInterests));
                } catch (e) {
                    console.error('Failed to parse interests', e);
                }
            }
        }
    }, []);

    useEffect(() => {
        async function fetchExplore() {
            try {
                // Fetch a large pool of products to filter from
                const data = await api.get<ProductsResponse>('/products?limit=100');
                let feedItems = data.products;

                // Determine target categories based on interests
                const targetCategories = new Set<string>();
                interests.forEach(interest => {
                    const categories = INTEREST_MAPPING[interest];
                    if (categories) {
                        categories.forEach(c => targetCategories.add(c));
                    }
                });

                // Filter items if we have specific interests
                if (targetCategories.size > 0) {
                    const filtered = feedItems.filter(item => targetCategories.has(item.category));

                    // If we found matches, use them. Otherwise fallback to mixed feed (discovery mode).
                    if (filtered.length > 0) {
                        feedItems = filtered;
                    }
                }

                // Randomize slightly for "discovery" feel and take top 20
                setPosts(feedItems.sort(() => 0.5 - Math.random()).slice(0, 20));
            } catch (error) {
                console.error('Failed to fetch explore feed', error);
            } finally {
                setLoading(false);
            }
        }

        // Always fetch, even if no interests (will show random)
        fetchExplore();
    }, [interests]);

    const toggleSave = (id: number) => {
        setSaved(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleLike = (id: number) => {
        setLiked(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/explore')} className="hover:bg-accent shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Following <Sparkles className="h-5 w-5 text-yellow-500" />
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {interests.length > 0
                                ? `Personalized for: ${interests.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')}`
                                : 'Trending across all topics'
                            }
                        </p>
                    </div>
                </div>
            </div>

            <motion.div
                className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
            >
                {posts.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="break-inside-avoid"
                    >
                        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                            <div className="aspect-square w-full bg-white relative flex items-center justify-center p-6 border-b">
                                {item.thumbnail && (
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.title}
                                        fill
                                        className="object-contain p-2 transition-transform group-hover:scale-105"
                                        unoptimized
                                    />
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
                                        onClick={() => toggleLike(item.id)}
                                    >
                                        <Heart className={cn("h-4 w-4", liked.has(item.id) ? "fill-red-500 text-red-500" : "text-gray-500")} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
                                        onClick={() => toggleSave(item.id)}
                                    >
                                        <Bookmark className={cn("h-4 w-4", saved.has(item.id) ? "fill-primary text-primary" : "text-gray-500")} />
                                    </Button>
                                </div>

                                <div className="absolute bottom-2 left-2">
                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-black/5 text-black/60 px-2 py-1 rounded-sm backdrop-blur-md">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base font-semibold line-clamp-1" title={item.title}>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                                    {item.description}
                                </p>
                                <Button size="sm" variant="outline" className="w-full gap-2 group/btn" asChild>
                                    <a href={`https://dummyjson.com/products/${item.id}`} target="_blank" rel="noopener noreferrer">
                                        Visit Website <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {posts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4 border-2 border-dashed rounded-xl"
                    >
                        <Sparkles className="h-12 w-12 text-muted-foreground/30" />
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">No items found</h3>
                            <p className="text-muted-foreground">Try selecting different topics in the Explore page!</p>
                        </div>
                        <Button variant="outline" onClick={() => router.push('/explore')}>
                            Back to Explore
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
