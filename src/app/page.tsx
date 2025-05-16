'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

// Define component option interface
interface PartOption {
  brand: string
  model: string
  socket?: string
  tdp?: number
}

// Available parts with brand, model, socket, TDP
const parts = {
  cpu: [
    { brand: 'AMD',   model: 'Ryzen 5 5600X',  socket: 'AM4',    tdp: 65  },
    { brand: 'AMD',   model: 'Ryzen 5 7600',   socket: 'AM5',    tdp: 65  },
    { brand: 'Intel', model: 'Core i5-12600K', socket: 'LGA1700', tdp: 125 },
    { brand: 'Intel', model: 'Core i7-13700K', socket: 'LGA1700', tdp: 125 },
  ],
  motherboard: [
    { brand: 'ASUS',     model: 'B550M Gaming',      socket: 'AM4'    },
    { brand: 'MSI',      model: 'MAG B650M Mortar',  socket: 'AM5'    },
    { brand: 'Gigabyte', model: 'X670E Aorus Elite', socket: 'AM5'    },
    { brand: 'ASUS',     model: 'ROG Strix Z790-E',  socket: 'LGA1700' },
  ],
  gpu: [
    { brand: 'NVIDIA', model: 'RTX 3060',          tdp: 170 },
    { brand: 'NVIDIA', model: 'RTX 4070',          tdp: 200 },
    { brand: 'AMD',    model: 'Radeon RX 7700 XT', tdp: 230 },
  ],
  ram: [
    { brand: 'Corsair',  model: '16GB DDR4-3200' },
    { brand: 'G.Skill',  model: '32GB DDR4-3600' },
    { brand: 'Kingston', model: '16GB DDR5-5200' },
  ],
  psu: [
    { brand: 'Seasonic',     model: '550W Bronze'  },
    { brand: 'Corsair',      model: '650W Gold'     },
    { brand: 'CoolerMaster', model: '850W Platinum'},
  ],
} as const

type PartKey = keyof typeof parts

type Selection = Partial<{ [K in PartKey]: typeof parts[K][number] }>

// Compatibility check: socket and PSU wattage
function checkCompatibility(selection: Selection): string {
  const cpu = selection.cpu
  const mb  = selection.motherboard

  // Socket mismatch check
  if (cpu?.socket && mb?.socket && cpu.socket !== mb.socket) {
    return `Socket mismatch: ${cpu.socket} vs ${mb.socket}.`;
  }

  // PSU wattage check
  const gpu = selection.gpu
  const totalTDP = (cpu?.tdp ?? 0) + (gpu?.tdp ?? 0)
  const psuName = selection.psu?.model ?? ''
  const psuW = parseInt(psuName.replace(/[^0-9]/g, ''), 10)
  if (psuW && totalTDP * 1.2 > psuW) {
    return `Insufficient PSU wattage: require ≥${Math.ceil(totalTDP * 1.2)}W.`;
  }

  return ''
}

export default function Home() {
  const [selection, setSelection] = useState<Selection>({})
  const errorMessage = checkCompatibility(selection)

  const handleSelect = (part: PartKey, model: string) => {
    const item = (parts[part] as readonly PartOption[]).find(p => p.model === model)
    if (item) setSelection(prev => ({ ...prev, [part]: item }))
  }

  const allSelected = (Object.keys(parts) as PartKey[]).every(key => !!selection[key])
  const buttonDisabled = Boolean(errorMessage) || !allSelected

  const entries = Object.entries(parts) as [PartKey, readonly PartOption[]][];
  return (
    <main className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">PC Builder (Compatibility)</h1>
      {entries.map(([part, options]) => (
        <div key={part} className="flex flex-col">
          <label className="mb-1 font-medium capitalize">{part}</label>
          <Select onValueChange={val => handleSelect(part, val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${part}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map(opt => (
                <SelectItem key={opt.model} value={opt.model}>
                  {opt.brand} {opt.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <Card>
        <CardContent>
          {errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : (
            <ul className="list-disc pl-5">
              {(Object.keys(parts) as PartKey[]).map(key => (
                <li key={key} className="capitalize">
                  {key}: {selection[key]?.brand} {selection[key]?.model || 'Not selected'}
                </li>
              ))}
            </ul>
          )}
          <Button
            className="mt-4 w-full"
            disabled={buttonDisabled}
            onClick={() => {
              alert(
                (Object.entries(selection) as [string, PartOption][])
                  .map(([k, v]) => `${k}: ${v.brand} ${v.model}`)
                  .join('\n')
              )
            }}
          >
            Confirm and Export
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}