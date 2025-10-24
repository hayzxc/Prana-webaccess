"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface AutocompleteInputProps {
  value: string;
  onValueChange: (value: string) => void;
  field: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

export function AutocompleteInput({
  value,
  onValueChange,
  field,
  placeholder = "Type to search...",
  disabled = false,
  className,
  label: _label,
  required = false,
}: AutocompleteInputProps) {
  const [open, setOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const debounceTimer = React.useRef<NodeJS.Timeout>();

  // Fetch suggestions from API
  const fetchSuggestions = React.useCallback(
    async (query: string) => {
      if (!query || query.length < 1) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/certificates/suggestions?field=${field}&query=${encodeURIComponent(
            query
          )}`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setSuggestions(result.data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [field]
  );

  // Debounce input changes
  React.useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (inputValue !== value) {
        fetchSuggestions(inputValue);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, value, fetchSuggestions]);

  // Update inputValue when value prop changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onValueChange(newValue);
    if (newValue.length >= 1) {
      setOpen(true);
    }
  };

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    onValueChange(selectedValue);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setOpen(true);
                } else if (inputValue.length >= 1) {
                  fetchSuggestions(inputValue);
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className="pr-10"
            />
            {suggestions.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setOpen(!open)}
                disabled={disabled}
              >
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : suggestions.length === 0 ? (
                <CommandEmpty>No suggestions found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={`${suggestion}-${index}`}
                      value={suggestion}
                      onSelect={() => handleSelect(suggestion)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          inputValue === suggestion
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

