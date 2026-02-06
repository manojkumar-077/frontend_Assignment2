'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Loader2, Plus, Search, Tag, Briefcase, Code, Heart, Star, BookOpen, Music, Coffee, Zap, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon mapping for dynamic rendering
const ICON_MAP: Record<string, React.ElementType> = {
    tag: Tag,
    briefcase: Briefcase,
    code: Code,
    heart: Heart,
    star: Star,
    book: BookOpen,
    music: Music,
    coffee: Coffee,
    zap: Zap,
    home: Home,
    settings: Settings,
};

const COLORS = [
    { name: 'Blue', value: 'bg-blue-500/10 text-blue-500' },
    { name: 'Red', value: 'bg-red-500/10 text-red-500' },
    { name: 'Green', value: 'bg-green-500/10 text-green-500' },
    { name: 'Yellow', value: 'bg-yellow-500/10 text-yellow-500' },
    { name: 'Purple', value: 'bg-purple-500/10 text-purple-500' },
    { name: 'Pink', value: 'bg-pink-500/10 text-pink-500' },
    { name: 'Orange', value: 'bg-orange-500/10 text-orange-500' },
];

interface Category {
    slug: string;
    name: string;
    url: string;
    iconName?: string;
    color?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newCategory, setNewCategory] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('tag');
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

    useEffect(() => {
        async function fetchCategories() {
            try {
                // Fetch product categories
                const data = await api.get<Category[]>('/products/categories');
                // Enhance data with default props since API doesn't have them
                const enhancedData = data.map(c => ({
                    ...c,
                    iconName: 'tag',
                    color: COLORS[0].value
                }));
                setCategories(enhancedData);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCategory = () => {
        if (!newCategory) return;
        const simulatedCategory: Category = {
            slug: newCategory.toLowerCase().replace(/\s+/g, '-'),
            name: newCategory,
            url: '#',
            iconName: selectedIcon,
            color: selectedColor
        };
        setCategories(prev => [simulatedCategory, ...prev]);
        setIsModalOpen(false);
        setNewCategory('');
        setSelectedIcon('tag');
        setSelectedColor(COLORS[0].value);
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Browse bookmarks by topic</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search categories..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCategories.map((category) => {
                    const Icon = ICON_MAP[category.iconName || 'tag'] || Tag;
                    const colorClass = category.color || 'bg-primary/10 text-primary';

                    return (
                        <Link key={category.slug} href={`/categories/${category.slug}`}>
                            <Card className="hover:bg-accent/50 transition-all cursor-pointer h-full border-border/50 bg-card/50 backdrop-blur-sm group">
                                <CardHeader className="flex flex-row items-center gap-3 p-6">
                                    <div className={cn("p-2.5 rounded-full transition-colors", colorClass)}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg capitalize font-medium">{category.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {Math.floor(Math.random() * 50) + 1} bookmarks
                                        </p>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Category"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            placeholder="e.g. Technology"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                            {Object.entries(ICON_MAP).map(([name, Icon]) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setSelectedIcon(name)}
                                    className={cn(
                                        "p-2 rounded-md flex items-center justify-center transition-colors hover:bg-accent",
                                        selectedIcon === name ? "bg-accent ring-2 ring-primary" : "bg-muted/50"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={cn(
                                        "w-8 h-8 rounded-full transition-all hover:scale-110",
                                        color.value.split(' ')[0].replace('/10', ''), // Use solid color for swatch
                                        selectedColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                                    )}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddCategory} disabled={!newCategory}>Add Category</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
