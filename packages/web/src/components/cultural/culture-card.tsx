'use client';
import { Globe, HandMetal, Banknote, Shirt, Camera, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface CultureSection {
  key: string;
  title: string;
  content: string;
}

interface CultureCardProps {
  country: string;
  countryCode: string;
  sections: CultureSection[];
}

const sectionIcons: Record<string, React.ElementType> = {
  greetings: HandMetal,
  tipping: Banknote,
  'dress-code': Shirt,
  photography: Camera,
  etiquette: BookOpen,
};

function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return '🏳️';
  return String.fromCodePoint(
    ...code.split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

export function CultureCard({ country, countryCode, sections }: CultureCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <span className="text-2xl">{getFlagEmoji(countryCode)}</span>
          <div>
            <span className="text-gray-900 dark:text-white">{country}</span>
            <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-0.5">
              Cultural Guide
            </p>
          </div>
          <Globe className="ml-auto h-5 w-5 text-accent" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section) => {
            const Icon = sectionIcons[section.key] || BookOpen;
            return (
              <AccordionItem key={section.key} value={section.key}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-accent" />
                    {section.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>{section.content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
