'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const INTERESTS = [
    { id: 'tech', label: 'Technology', icon: '💻' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'ai', label: 'AI Tools', icon: '🤖' },
    { id: 'dev', label: 'Development', icon: '👨‍💻' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'science', label: 'Science', icon: '🔬' },
];

export default function ExplorePage() {
    const router = useRouter();
    const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('markflow_interests');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Failed to parse interests', e);
                }
            }
        }
        return [];
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const toggleInterest = (interestId: string) => {
        setSelectedInterests(prev => {
            const newInterests = prev.includes(interestId)
                ? prev.filter(i => i !== interestId)
                : [...prev, interestId];

            // Save immediately
            localStorage.setItem('markflow_interests', JSON.stringify(newInterests));
            return newInterests;
        });
    };

    const handleContinue = () => {
        router.push('/explore/feed');
    };

    if (!mounted) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
            <div className="text-center space-y-4 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center gap-2 text-primary mb-4"
                >
                    <Compass className="h-8 w-8" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-4xl font-extrabold tracking-tight"
                >
                    Discover Your Interests
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    Select topics that inspire you to personalize your Markflow feed.
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, staggerChildren: 0.05 }}
            >
                {INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    return (
                        <motion.div
                            key={interest.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleInterest(interest.id)}
                            className={cn(
                                "relative group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 flex flex-col items-center justify-center text-center h-36 select-none shadow-sm",
                                isSelected
                                    ? "border-primary bg-primary/5 text-primary shadow-md"
                                    : "border-border bg-card hover:border-primary/30 hover:shadow-md hover:bg-accent/50"
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1"
                                >
                                    <Check className="h-3 w-3" />
                                </motion.div>
                            )}

                            <span className={cn("text-base font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                                {interest.label}
                            </span>
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center pt-12 gap-4"
            >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Selected {selectedInterests.length} topics</span>
                </div>
                <Button
                    size="lg"
                    className={cn(
                        "w-full max-w-sm h-12 text-lg font-medium transition-all shadow-lg",
                        selectedInterests.length > 0 ? "hover:shadow-primary/25 hover:scale-[1.02]" : ""
                    )}
                    onClick={handleContinue}
                    disabled={selectedInterests.length === 0}
                >
                    Continue to Feed <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </motion.div>
        </div>
    );
}
