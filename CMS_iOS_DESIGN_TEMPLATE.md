# CMS & Impact Sections - iOS/macOS Design System

## Components Created
- `src/components/ios/ToggleSwitch.tsx` - Interactive status toggle
- `src/components/ios/ListCard.tsx` - iOS squircle container
- `src/components/ios/DragHandle.tsx` - Drag-and-drop handle

## Pattern Applied to Hero Slides (Reference Implementation)
✅ **File**: `src/app/admin/cms/hero-slides/page.tsx`
- Modern iOS card design with squircle containers (rounded-2xl)
- Media-first preview: 16:9 thumbnail with image display
- Interactive toggle switch for quick publish/unpublish
- iOS sheet modal for create/edit with backdrop blur
- Drag handle for reordering (visual indicator for drag-and-drop)
- Clean action buttons (Edit, Delete) in card footer

## Template for Remaining Pages

### Services Page (`src/app/admin/cms/services/page.tsx`)
```
REPLACE:
- Static order field → Drag handle + visual reordering
- Inline form → iOS sheet modal
- Checkbox is_active → ToggleSwitch component

ADD:
- Icon preview container (w-12 h-12 rounded-xl bg-emerald-50)
- Service title, description, icon display
- Toggle switch for is_active status
- ListCard wrapper for each item
- Smooth animations and transitions
```

### Team Members Page (`src/app/admin/cms/team-members/page.tsx`)
```
FEATURES:
- Circular avatar (rounded-full w-12 h-12)
- Member name, role badge, department tag
- Toggle switch for is_active
- Drag handle for reordering
- Edit/Delete actions with improved styling
- iOS modal for create/edit
```

### Partners Page (`src/app/admin/cms/partners/page.tsx`)
```
FEATURES:
- Centered logo container (h-12 w-28 object-contain)
- Partner name and tier badge (Strategic, Gold, Silver)
- Toggle switch for is_active
- Website link indicator
- Clean white card with rounded corners
- iOS modal with logo upload support
```

## Impact & Community Pages

### Events Page (`src/app/admin/impact/events/page.tsx`)
```
FEATURES:
- Event date indicator (badge)
- Event name and description preview
- Attendee count (optional)
- Toggle for published/hidden
- Drag handle for reordering
- Edit/Delete/Duplicate actions
```

### Impact Metrics Page (`src/app/admin/impact/page.tsx`)
```
FEATURES:
- Icon container (w-12 h-12 rounded-xl bg-emerald-50)
- Metric title and value display
- Description truncated with line-clamp-1
- Status indicator (trend up/down)
- Edit/Delete actions
```

## Key Design Principles Applied

### Visual Hierarchy
```
Drag Handle | Thumbnail/Icon | Content (Title, Description, Badges) | Status Toggle | Actions
```

### iOS Modal Pattern
```
- Header with close button (✕)
- Form fields with soft focus states (bg-slate-50 → bg-white on focus)
- Floating labels or placeholder text
- Sticky footer with Cancel/Save buttons
- Backdrop blur for modal overlay
- Smooth animations (slide-in-from-right, zoom-in)
```

### Status Indicator
```
<ToggleSwitch
  checked={item.is_active}
  onChange={async (checked) => {
    // API call to update is_active
    await axios.patch(`${API_BASE_URL}/endpoint/${item.id}/`, 
      { is_active: checked },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  }}
/>
```

### ListCard Implementation
```
<ListCard key={item.id}>
  <div className="flex items-center gap-4 p-4">
    <DragHandle />
    {/* Thumbnail/Icon */}
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.description}</p>
      {/* Status badges */}
    </div>
    {/* Actions */}
    <div className="flex items-center gap-4 flex-shrink-0">
      <ToggleSwitch checked={item.is_active} onChange={handleToggle} />
      <button onClick={() => handleEdit(item)}>Edit</button>
      <button onClick={() => handleDelete(item.id)}>Delete</button>
    </div>
  </div>
</ListCard>
```

## CSS Classes Reference
- **Squircle container**: `rounded-2xl`
- **Shadow effect**: `shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]`
- **Focus state**: `focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`
- **Animation**: `animate-in slide-in-from-right-full md:zoom-in-95 duration-300`
- **Emerald accent**: `text-emerald-600 bg-emerald-50 border-emerald-200`

## Next Steps
1. ✅ Hero Slides - COMPLETE
2. Services - Apply template pattern
3. Team Members - Apply template pattern
4. Partners - Apply template pattern
5. Events - Apply template pattern
6. Impact Metrics - Apply template pattern
7. Registrations, RFQs, Sponsorships - Apply template pattern

All pages should follow the iOS design system established in Hero Slides for consistency.
