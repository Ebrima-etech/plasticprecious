# CMS iOS Refactor - Quick Template & Implementation Order

## ✅ COMPLETED
- **Hero Slides** - Full reference implementation
- **Services** - Just refactored ✅

## 📋 REMAINING PAGES (In Priority Order)

### 1. Team Members (`/admin/cms/team-members`)
**Key Difference**: Uses avatar image instead of icon
```jsx
// Import same as others
// State management identical
// Key difference in ListCard content:
<div className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0 overflow-hidden">
  <img src={photo} alt={name} className="w-full h-full object-cover" />
</div>

// Rest follows Services pattern
```

### 2. Partners (`/admin/cms/partners`)
**Key Difference**: Logo display box (28x14 container)
```jsx
// Same imports & setup
// Key difference:
<div className="w-28 h-14 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center p-2 flex-shrink-0">
  <img src={logo} alt={name} className="h-full object-contain" />
</div>

// Rest follows Services pattern
```

### 3. Impact Metrics (`/admin/impact`)
**Key Difference**: Stat display box (20x16 container)
```jsx
// Same imports & setup as Services
// Key difference:
<div className="w-20 h-16 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0">
  <div className="text-xl font-bold text-emerald-800">{value}</div>
  <div className="text-xs text-emerald-700">{unit}</div>
</div>

// Rest follows Services pattern
```

### 4. Events (`/admin/impact/events`)
**Key Difference**: Date badge box (14x16 container)
```jsx
// Same imports & setup
// Key difference:
<div className="w-14 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0">
  <div className="text-xs font-bold text-red-600 uppercase">{month}</div>
  <div className="text-lg font-bold text-slate-900">{date}</div>
</div>

// Rest follows Services pattern
```

### 5. Registrations (`/admin/impact/registrations`)
**Key Difference**: List/table style (not ListCard with grip)
```jsx
// Similar setup to Services but:
// - Remove DragHandle import (no reordering)
// - Use ListCard but with different flex layout
<ListCard>
  <div className="flex items-start justify-between p-4">
    <div className="flex-1">
      <h3 className="font-semibold">{applicant_name}</h3>
      <p className="text-xs text-slate-600">{applicant_email}</p>
      <p className="text-xs text-slate-500 mt-1">{timestamp}</p>
    </div>
    <div className="flex items-center gap-3 flex-shrink-0">
      {/* Status badge here */}
      <CMSActionMenu onEdit={...} onDelete={...} />
    </div>
  </div>
</ListCard>
```

### 6. RFQs (`/admin/impact/rfq`)
**Key Difference**: Similar to Registrations (table-style list)
```jsx
// Same as Registrations approach
// - ID badge: <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">RFQ #{id}</span>
// - Budget display: <p className="text-xs font-medium">Budget: D {budget.toLocaleString()}</p>
// - Status badge matching RFQ statuses
```

### 7. Sponsorships (`/admin/impact/sponsorship`)
**Key Difference**: Sponsor/company focus (similar to Partners)
```jsx
// Similar to Partners page
// - Logo or brand preview box
// - Company name and sponsorship tier
// - Toggle for active status
// - Rest follows Services pattern
```

## 🎯 Implementation Checklist for Each Page

1. **Import Required Components**
   ```jsx
   import { SlideOver } from '@/components/admin/SlideOver';
   import { ListCard } from '@/components/ios/ListCard';
   import { DragHandle } from '@/components/ios/DragHandle';
   import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
   import { CMSHeader } from '@/components/ios/CMSHeader';
   import { CMSActionMenu } from '@/components/ios/CMSActionMenu';
   ```

2. **Setup State**
   - `isDrawerOpen` for modal
   - `searchQuery` for search
   - `editingId` for tracking edit mode
   - `formData` for form state

3. **Add Functions**
   - `openDrawer()` - opens modal with empty or pre-filled form
   - `closeDrawer()` - closes modal and clears form
   - `handleSubmit()` - saves to API
   - `handleDelete()` - deletes with confirmation
   - `handleToggle()` - updates is_active via API

4. **Add Filters (Optional)**
   - `filteredItems` computed from search query
   - Optional: Add status filter tabs via CMSHeader

5. **Replace Return**
   - Use CMSHeader
   - Add SlideOver modal
   - Map items to ListCard components
   - Each ListCard has: DragHandle | Icon/Image | Content | Toggle | ActionMenu

## 📄 File Sizes (for reference)
- Hero Slides: ~220 lines (refactored)
- Services: ~150 lines (just refactored)
- Team Members: ~150-160 lines
- Partners: ~150-160 lines
- Impact Metrics: ~140-150 lines
- Events: ~160-170 lines
- Registrations: ~140-150 lines
- RFQs: ~130-140 lines
- Sponsorships: ~140-150 lines

**TOTAL ESTIMATE**: ~1,200 lines to refactor all 7 remaining pages

## 🎨 Consistent Pattern
All pages follow Hero Slides as the reference. The only variation is the "visual preview" box on the left side of each ListCard item.

## ⚡ Fast Track
To refactor all remaining pages efficiently:
1. Copy Services page template
2. For each page:
   - Replace API endpoint (`/services/` → `/endpoint/`)
   - Replace interface name and fields
   - Adjust the visual preview box HTML
   - Test CRUD operations

**Done in batches, should take ~2-3 hours total for one developer.**
