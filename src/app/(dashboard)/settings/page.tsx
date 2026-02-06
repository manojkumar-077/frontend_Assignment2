'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Settings as SettingsIcon,
    Palette,
    Database,
    Download,
    Upload,
    Trash2,
    Check,
    Moon,
    Sun,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSettings {
    defaultCategory: string;
    autoFetch: boolean;
    defaultRating: number;
    darkMode: boolean;
    language: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    defaultCategory: 'smartphones',
    autoFetch: true,
    defaultRating: 5,
    darkMode: false, // Defaulting to false to respect system preference usually, but here we can toggle
    language: 'en',
};

export default function SettingsPage() {
    const { logout } = useAuth();
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [mounted, setMounted] = useState(false);
    const [saveStatus, setSaveStatus] = useState(false);

    // Initialize from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('markflow_app_settings');
            if (saved) {
                try {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
                } catch (e) {
                    console.error('Failed to parse settings', e);
                }
            }
            setMounted(true);
        }
    }, []);

    // Save to localStorage whenever settings change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('markflow_app_settings', JSON.stringify(settings));
            // In a real app, we might apply theme changes here
            if (settings.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [settings, mounted]);

    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaveStatus(true);
        setTimeout(() => setSaveStatus(false), 2000);
    };

    const handleExport = () => {
        const bookmarks = localStorage.getItem('markflow_bookmarks') || '[]';
        const interests = localStorage.getItem('markflow_interests') || '[]';
        const exportData = {
            settings,
            bookmarks: JSON.parse(bookmarks),
            interests: JSON.parse(interests),
            exportDate: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `markflow_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportWrapper = () => {
        document.getElementById('import-file')?.click();
    };

    const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                if (data.settings) setSettings(data.settings);
                if (data.interests) localStorage.setItem('markflow_interests', JSON.stringify(data.interests));
                if (data.bookmarks) localStorage.setItem('markflow_bookmarks', JSON.stringify(data.bookmarks));

                alert('Data imported successfully! Reloading...');
                window.location.reload();
            } catch (err) {
                console.error('Import failed', err);
                alert('Failed to import data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
            localStorage.removeItem('markflow_bookmarks');
            localStorage.removeItem('markflow_interests');
            localStorage.removeItem('markflow_app_settings');
            setSettings(DEFAULT_SETTINGS);
            alert('All data cleared.');
            window.location.reload();
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Manage your application preferences and data.</p>
                </div>
                {saveStatus && (
                    <div className="flex items-center gap-2 text-green-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        <Check className="h-4 w-4" /> Changes saved
                    </div>
                )}
            </div>

            <div className="grid gap-8">
                {/* General Section */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <SettingsIcon className="h-5 w-5 text-primary" />
                        <CardTitle>General</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Default Category</p>
                                <p className="text-sm text-muted-foreground">Category used for new bookmarks by default.</p>
                            </div>
                            <select
                                className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={settings.defaultCategory}
                                onChange={(e) => updateSetting('defaultCategory', e.target.value)}
                            >
                                <option value="smartphones">Smartphones</option>
                                <option value="laptops">Laptops</option>
                                <option value="groceries">Groceries</option>
                                <option value="decoration">Decoration</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Auto-fetch content</p>
                                <p className="text-sm text-muted-foreground">Automatically refresh the feed on load.</p>
                            </div>
                            <button
                                onClick={() => updateSetting('autoFetch', !settings.autoFetch)}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                    settings.autoFetch ? 'bg-primary' : 'bg-muted'
                                )}
                            >
                                <span className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                    settings.autoFetch ? 'translate-x-6' : 'translate-x-1'
                                )} />
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Default Rating</p>
                                <p className="text-sm text-muted-foreground">Initial rating for new bookmarks (1-5).</p>
                            </div>
                            <Input
                                type="number"
                                min="1" max="5"
                                className="w-24"
                                value={settings.defaultRating}
                                onChange={(e) => updateSetting('defaultRating', Number(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Section */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Dark Mode</p>
                                <p className="text-sm text-muted-foreground">Toggle application theme.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4 text-muted-foreground" />
                                <button
                                    onClick={() => updateSetting('darkMode', !settings.darkMode)}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                        settings.darkMode ? 'bg-primary' : 'bg-muted'
                                    )}
                                >
                                    <span className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                                    )} />
                                </button>
                                <Moon className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-medium flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Language
                                </p>
                                <p className="text-sm text-muted-foreground">Select your preferred language.</p>
                            </div>
                            <select
                                className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={settings.language}
                                onChange={(e) => updateSetting('language', e.target.value)}
                            >
                                <option value="en">English (US)</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookmark Management Section */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        <CardTitle>Bookmark Management</CardTitle>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-4">
                        <Button variant="outline" className="w-full gap-2 flex flex-col h-auto py-6 hover:bg-primary/5 hover:border-primary/50" onClick={handleExport}>
                            <Download className="h-5 w-5" />
                            <div className="text-center">
                                <p className="font-semibold">Export Data</p>
                                <p className="text-[10px] text-muted-foreground">Download JSON backup</p>
                            </div>
                        </Button>

                        <div className="relative">
                            <input
                                id="import-file"
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={handleImportFile}
                            />
                            <Button
                                variant="outline"
                                className="w-full gap-2 flex flex-col h-auto py-6 hover:bg-primary/5 hover:border-primary/50 h-full"
                                onClick={handleImportWrapper}
                            >
                                <Upload className="h-5 w-5" />
                                <div className="text-center">
                                    <p className="font-semibold">Import Data</p>
                                    <p className="text-[10px] text-muted-foreground">Restore from JSON</p>
                                </div>
                            </Button>
                        </div>

                        <Button
                            variant="destructive"
                            className="w-full gap-2 flex flex-col h-auto py-6 bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 border"
                            onClick={handleClear}
                        >
                            <Trash2 className="h-5 w-5" />
                            <div className="text-center">
                                <p className="font-semibold">Clear All Data</p>
                                <p className="text-[10px] text-destructive/70">Wipe all local storage</p>
                            </div>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Sign Out</p>
                                <p className="text-sm text-muted-foreground">Delete session and return to login.</p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={logout}>
                                Log Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
