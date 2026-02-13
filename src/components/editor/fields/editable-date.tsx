'use client';

import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditableDateProps {
  label: string;
  value: string; // "YYYY-MM" format
  onChange: (value: string) => void;
}

const MONTHS = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12',
];

const MONTH_LABELS: Record<string, string> = {
  '01': '1月', '02': '2月', '03': '3月', '04': '4月',
  '05': '5月', '06': '6月', '07': '7月', '08': '8月',
  '09': '9月', '10': '10月', '11': '11月', '12': '12月',
};

export function EditableDate({ label, value, onChange }: EditableDateProps) {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const arr: string[] = [];
    for (let y = currentYear + 5; y >= currentYear - 50; y--) {
      arr.push(String(y));
    }
    return arr;
  }, [currentYear]);

  const [selectedYear, selectedMonth] = useMemo(() => {
    if (!value) return ['', ''];
    const parts = value.split('-');
    return [parts[0] || '', parts[1] || ''];
  }, [value]);

  const displayText = useMemo(() => {
    if (!selectedYear || !selectedMonth) return '';
    return `${selectedYear}年${MONTH_LABELS[selectedMonth] || selectedMonth}`;
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (year: string) => {
    const month = selectedMonth || '01';
    onChange(`${year}-${month}`);
  };

  const handleMonthChange = (month: string) => {
    const year = selectedYear || String(currentYear);
    onChange(`${year}-${month}`);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-full cursor-pointer justify-start text-sm font-normal"
          >
            <CalendarDays className="mr-2 h-3.5 w-3.5 text-zinc-400" />
            {displayText ? (
              <span>{displayText}</span>
            ) : (
              <span className="text-zinc-400">{label}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <div className="space-y-2">
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="年份" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="月份" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {MONTH_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {value && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-full cursor-pointer text-xs text-zinc-400"
                onClick={handleClear}
              >
                清除
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
