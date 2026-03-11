'use client';
import * as React from 'react';
import { ArrowRightLeft, Copy, Check, Languages } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
];

interface TranslatorPanelProps {
  onTranslate?: (source: string, from: string, to: string) => Promise<{
    translated: string;
    transliteration?: string;
  }>;
}

export function TranslatorPanel({ onTranslate }: TranslatorPanelProps) {
  const [fromLang, setFromLang] = React.useState('en');
  const [toLang, setToLang] = React.useState('hi');
  const [sourceText, setSourceText] = React.useState('');
  const [result, setResult] = React.useState('');
  const [transliteration, setTransliteration] = React.useState('');
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const swap = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setSourceText(result);
    setResult(sourceText);
    setTransliteration('');
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() || !onTranslate) return;
    setIsTranslating(true);
    try {
      const res = await onTranslate(sourceText, fromLang, toLang);
      setResult(res.translated);
      setTransliteration(res.transliteration || '');
    } catch {
      setResult('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Languages className="h-5 w-5 text-accent" />
          Translator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language selectors */}
        <div className="flex items-center gap-2">
          <Select value={fromLang} onValueChange={setFromLang}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={swap} className="shrink-0">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <Select value={toLang} onValueChange={setToLang}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Source text */}
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter text to translate..."
          rows={4}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />

        {/* Translate button */}
        <Button
          variant="accent"
          className="w-full"
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isTranslating}
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </Button>

        {/* Result */}
        {result && (
          <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-sm text-gray-900 dark:text-white pr-8">{result}</p>
            {transliteration && (
              <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
                {transliteration}
              </p>
            )}
            <button
              onClick={copyResult}
              className="absolute top-3 right-3 rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Copy"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
