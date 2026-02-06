'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

const categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
];

export default function AddBookmarkPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [rating, setRating] = useState('5');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add Product to DummyJSON
            await api.post('/products/add', {
                title,
                description,
                category,
                rating: Number(rating),
            });
            setSuccess(true);
            setTimeout(() => {
                router.push('/home');
            }, 1500);
        } catch (error) {
            console.error('Failed to add bookmark', error);
            alert('Failed to add bookmark. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold text-green-500">Success!</h2>
                <p className="text-muted-foreground">Bookmark added. Redirecting...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Add Bookmark</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>New Bookmark Details</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Note: Data submitted to DummyJSON is simulated and will not persist permanently.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Title</label>
                            <Input
                                id="title"
                                placeholder="Product Name / Bookmark Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Input
                                id="description"
                                placeholder="Short description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="category" className="text-sm font-medium">Category</label>
                                <select
                                    id="category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="rating" className="text-sm font-medium">Rating (0-5)</label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" loading={loading}>
                                Save Bookmark
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
