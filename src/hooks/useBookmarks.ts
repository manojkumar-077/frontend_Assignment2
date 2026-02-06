'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Bookmark, Product, ProductsResponse } from '@/types';

// Map DummyJSON product to Bookmark
const mapProductToBookmark = (product: Product): Bookmark => ({
    id: product.id,
    title: product.title,
    url: `https://dummyjson.com/products/${product.id}`,
    category: product.category,
    thumbnail: product.thumbnail,
    userId: 0, // Products don't have simulated userId
    description: product.description,
    rating: product.rating,
});

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookmarks = async () => {
        setLoading(true);
        try {
            // Fetch products instead of posts
            const data = await api.get<ProductsResponse>('/products?limit=10');
            const mapped = data.products.map(mapProductToBookmark);
            setBookmarks(mapped);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch bookmarks';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    return { bookmarks, loading, error, refresh: fetchBookmarks, setBookmarks };
}
