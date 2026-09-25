# CMS & Impact Sections - Unified iOS Design Specification

## Core Components Available
- `CMSHeader` - Search, filters, item count, add button
- `CMSActionMenu` - Edit, Delete, Duplicate, Preview options
- `ListCard` - iOS squircle container with shadows
- `ToggleSwitch` - Active/Published toggle
- `DragHandle` - Reordering grip icon

## Universal Layout Pattern

All CMS pages follow this identical structure:

```
┌─────────────────────────────────────────────┐
│ CMSHeader (Title | Count | Search | Filters│ Add Button)
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐│
│  │ ListCard                                 ││
│  │ [Grip] [Thumbnail/Icon] [Content] [Toggle] [Actions]
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ ListCard                                 ││
│  │ [Grip] [Thumbnail/Icon] [Content] [Toggle] [Actions]
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

## Page-Specific Details

### Hero Slides (`/admin/cms/hero-slides`)
**Already Refactored ✅**
- 16:9 thumbnail preview (w-36 h-20)
- Title + description
- Active toggle switch
- Edit/Delete/Preview actions

### Services (`/admin/cms/services`)
```jsx
<ListCard>
  <div className="flex items-center gap-4 p-4">
    <DragHandle />
    
    {/* Icon */}
    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
      {icon}
    </div>
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900">{name}</h3>
      <p className="text-xs text-slate-600 line-clamp-1">{description}</p>
    </div>
    
    {/* Actions */}
    <ToggleSwitch checked={is_active} onChange={handleToggle} />
    <CMSActionMenu onEdit={...} onDelete={...} />
  </div>
</ListCard>
```

### Team Members (`/admin/cms/team-members`)
```jsx
<ListCard>
  <div className="flex items-center gap-4 p-4">
    <DragHandle />
    
    {/* Avatar */}
    <img 
      src={photo} 
      alt={name}
      className="w-12 h-12 rounded-full object-cover border border-slate-200"
    />
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900">{name}</h3>
      <p className="text-xs text-slate-600">{role}</p>
      <div className="flex gap-2 mt-1">
        <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
          {department}
        </span>
      </div>
    </div>
    
    {/* Actions */}
    <ToggleSwitch checked={is_active} onChange={handleToggle} />
    <CMSActionMenu onEdit={...} onDelete={...} />
  </div>
</ListCard>
```

### Partners (`/admin/cms/partners`)
```jsx
<ListCard>
  <div className="flex items-center gap-4 p-4">
    <DragHandle />
    
    {/* Logo */}
    <div className="w-28 h-14 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center p-2 flex-shrink-0">
      <img src={logo} alt={name} className="h-full object-contain" />
    </div>
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900">{name}</h3>
      <div className="flex gap-2 mt-1">
        <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
          {tier}
        </span>
      </div>
    </div>
    
    {/* Actions */}
    <ToggleSwitch checked={is_active} onChange={handleToggle} />
    <CMSActionMenu onEdit={...} onDelete={...} onDuplicate={...} />
  </div>
</ListCard>
```

### Impact Metrics (`/admin/impact`)
```jsx
<ListCard>
  <div className="flex items-center gap-4 p-4">
    <DragHandle />
    
    {/* Stat Box */}
    <div className="w-20 h-16 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0">
      <div className="text-xl font-bold text-emerald-800">{value}</div>
      <div className="text-xs text-emerald-700">{unit}</div>
    </div>
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-600 mt-1">{description}</p>
      {changePercent && (
        <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-700">
          ↗ {changePercent}% this month
        </span>
      )}
    </div>
    
    {/* Actions */}
    <CMSActionMenu onEdit={...} onDelete={...} />
  </div>
</ListCard>
```

### Events (`/admin/impact/events`)
```jsx
<ListCard>
  <div className="flex items-center gap-4 p-4">
    <DragHandle />
    
    {/* Date Badge */}
    <div className="w-14 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0">
      <div className="text-xs font-bold text-red-600 uppercase">
        {month}
      </div>
      <div className="text-lg font-bold text-slate-900">{date}</div>
    </div>
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-600 mt-1">{location}</p>
      <div className="flex gap-2 mt-2">
        <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
          {time}
        </span>
        <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
          {registrations}/{capacity}
        </span>
      </div>
    </div>
    
    {/* Actions */}
    <ToggleSwitch checked={is_published} onChange={handleToggle} />
    <CMSActionMenu onEdit={...} onDelete={...} onDuplicate={...} onPreview={...} />
  </div>
</ListCard>
```

### Registrations & Submissions (`/admin/impact/registrations`)
```jsx
<ListCard>
  <div className="flex items-start justify-between p-4">
    {/* Left Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-slate-900">{applicant_name}</h3>
        <span className="text-xs text-slate-500">{applicant_company}</span>
      </div>
      <p className="text-xs text-slate-600 mt-1">{applicant_email}</p>
      <p className="text-xs text-slate-500 mt-1">Applied: {formatDate(created_at)}</p>
    </div>
    
    {/* Status Badge */}
    <div className="flex items-center gap-3 flex-shrink-0">
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
        status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
        status === 'pending' ? 'bg-amber-100 text-amber-800' :
        'bg-slate-100 text-slate-800'
      }`}>
        {statusLabel}
      </span>
      <CMSActionMenu onEdit={...} onDelete={...} />
    </div>
  </div>
</ListCard>
```

### RFQs (`/admin/impact/rfq`)
```jsx
<ListCard>
  <div className="flex items-start justify-between p-4">
    {/* Left Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
          RFQ #{id}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 mt-2">{requester_name}</h3>
      <p className="text-xs text-slate-600">{requester_company}</p>
      <p className="text-xs text-slate-600 mt-1">{category}</p>
      {budget && (
        <p className="text-xs font-medium text-slate-900 mt-2">
          Budget: D {budget.toLocaleString()}
        </p>
      )}
    </div>
    
    {/* Status & Actions */}
    <div className="flex items-center gap-3 flex-shrink-0">
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
        {status}
      </span>
      <CMSActionMenu onEdit={...} onDelete={...} />
    </div>
  </div>
</ListCard>
```

## Modal/Form Pattern (iOS Sheet)

All create/edit forms use the SlideOver component with:

```jsx
<SlideOver
  isOpen={isOpen}
  onClose={handleClose}
  title={editingId ? 'Edit Item' : 'Create Item'}
  description="Brief description"
  footer={
    <>
      <button onClick={handleClose} className="...">Cancel</button>
      <button onClick={handleSave} className="...">Save</button>
    </>
  }
>
  {/* Form fields with iOS styling */}
  <div className="space-y-5">
    <div>
      <label className="text-xs font-semibold text-slate-600 block mb-2">Field Name *</label>
      <input
        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
        placeholder="Placeholder text"
      />
    </div>
  </div>
</SlideOver>
```

## Implementation Checklist

For each page to implement:

- [ ] Import CMSHeader, CMSActionMenu, ListCard, ToggleSwitch, DragHandle
- [ ] Create state for search, filters, expanded items
- [ ] Replace old form with SlideOver modal
- [ ] Update list items to use ListCard + flex layout
- [ ] Add drag handle on left
- [ ] Add toggle switch for is_active/is_published
- [ ] Add CMSActionMenu on right
- [ ] Implement search & filter logic
- [ ] Test all CRUD operations
- [ ] Verify responsive design

## Pages Status

- ✅ Hero Slides - COMPLETE
- ⏳ Services - Ready for implementation
- ⏳ Team Members - Ready for implementation
- ⏳ Partners - Ready for implementation
- ⏳ Impact Metrics - Ready for implementation
- ⏳ Events - Ready for implementation
- ⏳ Registrations - Ready for implementation
- ⏳ Sponsorships - Ready for implementation
- ⏳ RFQs - Ready for implementation

All pages share the same iOS design language, component library, and interaction patterns.
