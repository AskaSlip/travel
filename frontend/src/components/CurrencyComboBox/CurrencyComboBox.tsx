"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FC, useEffect, useState } from 'react';

interface CurrencyOption {
  value: string;
  label: string;
}

interface IProps {
  currency: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  currentUserCurrency?: string;
}

const CurrencyComboBox: FC<IProps> = ({ currency, value, onChange, currentUserCurrency }) => {
  const [open, setOpen] = useState<boolean>(false)

  const currencies: CurrencyOption[] = Object.entries(currency).map(([key, value]) => ({
    value: key,
    label: value
  }))

  useEffect(() => {
    if (currentUserCurrency && !value) {
      const exists = currencies.find((curr) => curr.value === currentUserCurrency);
      if (exists) {
        onChange(currentUserCurrency);
      }
    }
  }, [currentUserCurrency, value, currencies, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? currencies.find((currency) => currency.value === value)?.label
            : "Select currency..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Choose currency..." className="h-9" />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={ currency.label}
                  onSelect={() => {
                    onChange(currency.value)
                    setOpen(false)
                  }}
                >
                  {currency.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === currency.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CurrencyComboBox;
