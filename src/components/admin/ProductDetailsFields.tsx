'use client';

import { FiPlus, FiTrash2 } from 'react-icons/fi';

export interface SpecRow {
  label: string;
  value: string;
}

export const DEFAULT_WARRANTY = '1-year limited warranty';

// Quick-add labels for common specifications
const SUGGESTED_LABELS = ['Dimensions', 'Weight', 'Material', 'Colour', 'Capacity', 'Load capacity', 'Finish', 'Assembly'];

const inputClass = 'w-full px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';

interface ProductDetailsFieldsProps {
  specs: SpecRow[];
  onSpecsChange: (specs: SpecRow[]) => void;
  warranty: string;
  onWarrantyChange: (warranty: string) => void;
}

export default function ProductDetailsFields({ specs, onSpecsChange, warranty, onWarrantyChange }: ProductDetailsFieldsProps) {
  const update = (index: number, field: keyof SpecRow, value: string) =>
    onSpecsChange(specs.map((row, i) => (i === index ? { ...row, [field]: value } : row)));

  const add = (label = '') => onSpecsChange([...specs, { label, value: '' }]);
  const remove = (index: number) => onSpecsChange(specs.filter((_, i) => i !== index));
  const unusedSuggestions = SUGGESTED_LABELS.filter(label => !specs.some(s => s.label.toLowerCase() === label.toLowerCase()));

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">Product Details</label>
      <p className="text-xs text-neutral-500 mb-3">
        Shown under &quot;Detailed Specifications&quot; on the product page. Rows left empty are ignored.
      </p>
      <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        {specs.length === 0 && (
          <p className="text-sm text-neutral-500">No specifications yet. Add dimensions, weight, material and so on.</p>
        )}
        {specs.map((row, index) => (
          <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
            <input
              type="text"
              maxLength={80}
              value={row.label}
              onChange={(e) => update(index, 'label', e.target.value)}
              placeholder="Label, e.g. Dimensions"
              aria-label={`Specification ${index + 1} label`}
              className={inputClass}
            />
            <input
              type="text"
              maxLength={255}
              value={row.value}
              onChange={(e) => update(index, 'value', e.target.value)}
              placeholder="Value, e.g. 45 x 45 x 80 cm"
              aria-label={`Specification ${index + 1} value`}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              aria-label={`Remove specification ${index + 1}`}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => add()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-100"
          >
            <FiPlus className="w-3.5 h-3.5" /> Add row
          </button>
          {unusedSuggestions.map(label => (
            <button
              key={label}
              type="button"
              onClick={() => add(label)}
              className="px-2.5 py-1 text-xs text-neutral-600 bg-white border border-dashed border-neutral-300 rounded-full hover:border-primary-400"
            >
              + {label}
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-neutral-200">
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Warranty</label>
          <input
            type="text"
            maxLength={120}
            value={warranty}
            onChange={(e) => onWarrantyChange(e.target.value)}
            placeholder={DEFAULT_WARRANTY}
            className={inputClass}
          />
          <p className="text-xs text-neutral-500 mt-1">Shown on the product page, e.g. &quot;1-year limited warranty&quot;.</p>
        </div>
      </div>
    </div>
  );
}
