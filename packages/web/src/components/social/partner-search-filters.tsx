'use client';
import * as React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PartnerFilters {
  destination: string;
  startDate: string;
  endDate: string;
  vehicleTypes: string[];
  tripType: string;
  language: string;
}

interface PartnerSearchFiltersProps {
  onApply?: (filters: PartnerFilters) => void;
  onReset?: () => void;
}

const vehicleTypes = ['Car', 'Bike', 'Bus', 'Train', 'Plane', 'Ship'];
const tripTypes = ['All', 'Solo', 'Duo', 'Squad', 'Group'];

export function PartnerSearchFilters({ onApply, onReset }: PartnerSearchFiltersProps) {
  const [destination, setDestination] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedVehicles, setSelectedVehicles] = React.useState<string[]>([]);
  const [tripType, setTripType] = React.useState('All');
  const [language, setLanguage] = React.useState('');

  const toggleVehicle = (v: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const handleApply = () => {
    onApply?.({
      destination,
      startDate,
      endDate,
      vehicleTypes: selectedVehicles,
      tripType,
      language,
    });
  };

  const handleReset = () => {
    setDestination('');
    setStartDate('');
    setEndDate('');
    setSelectedVehicles([]);
    setTripType('All');
    setLanguage('');
    onReset?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="h-4 w-4 text-accent" />
          Find Partners
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Destination */}
        <Input
          label="Destination"
          placeholder="Where are you heading?"
          icon={<Search className="h-4 w-4" />}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="From"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="To"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Vehicle types (multi-select via buttons) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vehicle Types
          </label>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => toggleVehicle(v)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  selectedVehicles.includes(v)
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Trip type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Trip Type
          </label>
          <Select value={tripType} onValueChange={setTripType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tripTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <Input
          label="Language"
          placeholder="e.g., English, Hindi"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="accent" className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
