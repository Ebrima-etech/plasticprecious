'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiUsers, FiKey, FiCheckCircle, FiXCircle, FiPlus, FiChevronLeft, FiChevronRight, FiSave } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';
import { getErrorMessage } from '@/lib/api-errors';

interface Staff {
  id: number;
  user: number;
  user_data?: { username: string; first_name: string; last_name: string; email: string };
  department: number;
  department_name: string;
  role: string;
  role_display: string;
  permissions: string[];
  salary: string;
  hire_date: string;
  is_active: boolean;
  phone_number: string;
  address: string;
  admin_access?: boolean;
}

interface Department {
  id: number;
  name: string;
}

interface Candidate {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_joined: string;
}

const ROLES = [
  { value: 'manager', label: 'Manager' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'deliverer', label: 'Deliverer' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'technician', label: 'Technician' },
  { value: 'driver', label: 'Driver' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'intern', label: 'Intern' },
  { value: 'other', label: 'Other' },
];

const PERMISSIONS = [
  { value: 'view_reports', label: 'View Reports' },
  { value: 'edit_products', label: 'Edit Products' },
  { value: 'manage_orders', label: 'Manage Orders' },
  { value: 'manage_payments', label: 'Manage Payments' },
  { value: 'manage_users', label: 'Manage Users' },
  { value: 'manage_staff', label: 'Manage Staff' },
  { value: 'view_analytics', label: 'View Analytics' },
  { value: 'manage_inventory', label: 'Manage Inventory' },
  { value: 'export_data', label: 'Export Data' },
  { value: 'create_reports', label: 'Create Reports' },
];

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  department: '',
  role: '',
  permissions: [] as string[],
  salary: '',
  hire_date: '',
  phone_number: '',
  address: '',
  admin_access: false,
};

export default function StaffAdmin() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState<{ password: string; email: string } | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);
  // "new" creates a new account; "existing" turns an existing user (e.g. a customer) into staff
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [selectedUser, setSelectedUser] = useState<Candidate | null>(null);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchingCandidates, setSearchingCandidates] = useState(false);

  const isExistingMode = !editingId && mode === 'existing';

  useEffect(() => {
    if (!showForm || !isExistingMode || selectedUser) return;
    setSearchingCandidates(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/staff/staff/candidates/`, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
          params: candidateSearch.trim() ? { search: candidateSearch.trim() } : {},
        });
        setCandidates(res.data);
      } catch (err) {
        console.error('Failed to search users:', err);
        setCandidates([]);
      } finally {
        setSearchingCandidates(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [showForm, isExistingMode, selectedUser, candidateSearch]);

  const chooseUser = (user: Candidate) => {
    setSelectedUser(user);
    setFormError('');
    // Bring over what we already know about them
    setFormData(prev => ({ ...prev, phone_number: prev.phone_number || user.phone || '' }));
  };

  const switchMode = (next: 'new' | 'existing') => {
    setMode(next);
    setSelectedUser(null);
    setCandidateSearch('');
    setFormError('');
  };

  const DRAFT_KEY = 'staff_form_draft';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getAccessToken();
      const [staffRes, deptRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/staff/staff/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/staff/departments/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStaff(staffRes.data.results || staffRes.data);
      setDepartments(deptRes.data.results || deptRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    }
  };

  // Returns an error message for the given step, or '' if it is complete
  const stepError = (step: number) => {
    if (step === 1) {
      if (isExistingMode) {
        if (!selectedUser) return 'Search for and select the user to make staff.';
      } else {
        if (!formData.first_name.trim() || !formData.last_name.trim()) return 'Enter first and last name.';
        if (!editingId && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) return 'Enter a valid email address.';
      }
    }
    if (step === 2) {
      if (!formData.department || !formData.role || !formData.hire_date) return 'Choose a department, role and hire date.';
      if (formData.salary && parseFloat(formData.salary) < 0) return 'Salary cannot be negative.';
    }
    if (step === 3 && !editingId && !isExistingMode && formData.password && formData.password.length < 8) {
      return 'Password must be at least 8 characters, or leave it blank to generate one.';
    }
    return '';
  };

  const handleSave = async () => {
    const firstInvalid = [1, 2, 3].find(step => stepError(step));
    if (firstInvalid) {
      setCurrentStep(firstInvalid);
      setFormError(stepError(firstInvalid));
      return;
    }
    setFormError('');
    setSaving(true);
    try {
      const token = getAccessToken();
      const common = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        department: Number(formData.department),
        role: formData.role,
        permissions: formData.permissions,
        salary: formData.salary ? formData.salary : null,
        hire_date: formData.hire_date,
        phone_number: formData.phone_number.trim(),
        address: formData.address.trim(),
        admin_access: formData.admin_access,
      };

      if (editingId) {
        await axios.patch(`${API_BASE_URL}/staff/staff/${editingId}/`, common, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (isExistingMode && selectedUser) {
        // Names and login stay as they are on the user's account
        const { first_name: _first, last_name: _last, ...staffFields } = common;
        await axios.post(
          `${API_BASE_URL}/staff/staff/`,
          { ...staffFields, user_id: selectedUser.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/staff/staff/`,
          { ...common, email: formData.email.trim(), password: formData.password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.temporary_password) {
          setShowPassword({ password: response.data.temporary_password, email: formData.email.trim() });
        }
      }
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save staff:', err);
      setFormError(getErrorMessage(err, 'Error saving staff member.'));
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (request: () => Promise<unknown>, failure: string) => {
    try {
      await request();
      fetchData();
    } catch (err) {
      console.error(failure, err);
      alert(getErrorMessage(err, failure));
    }
  };

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } });

  const handleDelete = (s: Staff) => {
    const name = `${s.user_data?.first_name ?? ''} ${s.user_data?.last_name ?? ''}`.trim() || 'this staff member';
    if (!confirm(`Delete ${name}? Their staff record is removed and their account is switched off.`)) return;
    runAction(() => axios.delete(`${API_BASE_URL}/staff/staff/${s.id}/`, authHeaders()), 'Failed to delete staff member.');
  };

  const handleActivate = (id: number) =>
    runAction(() => axios.post(`${API_BASE_URL}/staff/staff/${id}/activate/`, {}, authHeaders()), 'Failed to activate staff member.');

  const handleDeactivate = (id: number) =>
    runAction(() => axios.post(`${API_BASE_URL}/staff/staff/${id}/deactivate/`, {}, authHeaders()), 'Failed to deactivate staff member.');

  const handleResetPassword = async (s: Staff) => {
    if (!confirm(`Reset the password for ${s.user_data?.email}? Their current password will stop working.`)) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/staff/${s.id}/reset_password/`, {}, authHeaders());
      setShowPassword({ password: response.data.temporary_password, email: response.data.email });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to reset password.'));
    }
  };


  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  useEffect(() => {
    // Load drafts from localStorage
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        setDrafts(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load drafts:', err);
      }
    }
  }, []);

  const saveDraft = () => {
    const draftId = `draft_${Date.now()}`;
    const newDraft = {
      id: draftId,
      data: { ...formData, password: "" }, // never keep passwords in localStorage
      createdAt: Date.now()
    };

    const updatedDrafts = [...drafts, newDraft];
    setDrafts(updatedDrafts);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDrafts));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const loadDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      // Older drafts may lack newer fields, so fill in defaults
      setFormData({ ...EMPTY_FORM, ...draft.data });
      setEditingId(null);
      switchMode('new');
      setCurrentStep(1);
    }
  };

  const deleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDrafts));
  };

  const openForm = (s?: Staff) => {
    setCurrentStep(1);
    if (s) {
      // Editing existing staff member
      setEditingId(s.id);
      setFormData({
        ...EMPTY_FORM,
        first_name: s.user_data?.first_name || '',
        last_name: s.user_data?.last_name || '',
        email: s.user_data?.email || '',
        department: s.department ? s.department.toString() : '',
        role: s.role,
        permissions: s.permissions || [],
        salary: s.salary || '',
        hire_date: s.hire_date || '',
        phone_number: s.phone_number || '',
        address: s.address || '',
        admin_access: !!s.admin_access,
      });
    } else {
      // Creating new staff member - fresh form
      setEditingId(null);
      setFormData(EMPTY_FORM);
    }
    switchMode('new');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setCurrentStep(1);
    setEditingId(null);
    switchMode('new');
    setFormData(EMPTY_FORM);
  };

  const nextStep = () => {
    const error = stepError(currentStep);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError('');
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 300ms ease-out;
        }
      `}</style>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FiUsers className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Staff Members</h1>
            <p className="text-sm text-slate-600">Manage your team and access permissions</p>
          </div>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      {/* Drafts Display */}
      {!showForm && drafts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Saved Drafts</h3>
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
              {drafts.length} {drafts.length === 1 ? 'Draft' : 'Drafts'}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-lg p-3 border border-blue-100 flex items-center justify-between hover:border-blue-300 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {draft.data.first_name || 'Unnamed'} {draft.data.last_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(draft.createdAt).toLocaleDateString()} {new Date(draft.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => {
                      loadDraft(draft.id);
                      setShowForm(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDraft(draft.id)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                    title="Delete draft"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Temporary Password Alert */}
      {showPassword && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <p className="text-sm text-amber-800 font-semibold mb-2">Temporary password for {showPassword.email}:</p>
          <p className="text-lg font-mono text-amber-900 mb-2 bg-white p-2 rounded select-all">{showPassword.password}</p>
          <p className="text-xs text-amber-700">
            Share this password with the staff member securely. It is shown only once; they should change it after signing in.
          </p>
          <button
            onClick={() => setShowPassword(null)}
            className="mt-3 px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition"
          >
            Close
          </button>
        </div>
      )}

      {/* Multi-Step Inline Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <span className="text-sm font-semibold text-slate-600 bg-emerald-50 px-3 py-1 rounded-full">
                Step {currentStep} of 3
              </span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    step <= currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6 mb-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                {!editingId && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { value: 'new', title: 'Create a new staff account', desc: 'Sets up a new login for someone without an account' },
                      { value: 'existing', title: 'Make an existing user staff', desc: 'Pick someone who already has an account; their login stays the same' },
                    ] as const).map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => switchMode(option.value)}
                        className={`text-left p-4 rounded-xl border-2 transition ${
                          mode === option.value ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-slate-900">{option.title}</span>
                        <span className="block text-xs text-slate-600 mt-1">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                )}

                {isExistingMode && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">Choose the user</label>
                    {selectedUser ? (
                      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {`${selectedUser.first_name} ${selectedUser.last_name}`.trim() || selectedUser.email}
                          </p>
                          <p className="text-sm text-slate-600 truncate">{selectedUser.email}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Member since {new Date(selectedUser.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedUser(null)}
                          className="px-3 py-1.5 text-sm font-medium text-emerald-700 border border-emerald-300 rounded-lg hover:bg-white"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="search"
                          autoFocus
                          value={candidateSearch}
                          onChange={(e) => setCandidateSearch(e.target.value)}
                          placeholder="Search by name, email or phone"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100">
                          {searchingCandidates ? (
                            <p className="p-4 text-sm text-slate-500">Searching…</p>
                          ) : candidates.length === 0 ? (
                            <p className="p-4 text-sm text-slate-500">
                              {candidateSearch ? 'No matching users who aren’t already staff.' : 'No users available.'}
                            </p>
                          ) : (
                            candidates.map(user => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => chooseUser(user)}
                                className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition"
                              >
                                <span className="block text-sm font-semibold text-slate-900">
                                  {`${user.first_name} ${user.last_name}`.trim() || 'No name'}
                                </span>
                                <span className="block text-xs text-slate-600">{user.email}{user.phone ? ` · ${user.phone}` : ''}</span>
                              </button>
                            ))
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Only active users who aren’t staff yet are listed (up to 20 matches).</p>
                      </>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-4">
                    {isExistingMode ? 'Contact details' : 'Personal Information'}
                  </label>
                  <div className="space-y-4">
                    {!isExistingMode && (<>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-2">First Name *</label>
                        <input
                          type="text"
                          placeholder="Muhammed"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-2">Last Name *</label>
                        <input
                          type="text"
                          placeholder="Sanneh"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-2">Email Address *</label>
                      <input
                        type="email"
                        placeholder="muhammed@preciousplastic.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!!editingId}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>
                    </>)}
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+220 3011234"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-2">Address</label>
                      <input
                        type="text"
                        placeholder="Serrekunda, Banjul"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-4">Employment Details</label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-2">Department *</label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-2">Role *</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">Select Role</option>
                          {ROLES.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-2">Hire Date *</label>
                        <input
                          type="date"
                          value={formData.hire_date}
                          onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-2">Salary</label>
                        <div className="relative">
                          <span className="absolute left-4 top-2.5 text-slate-600 font-medium text-sm">D</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={formData.salary}
                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                            className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Permissions */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-4">Access & Permissions</label>
                  {!editingId && !isExistingMode && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <label className="text-xs font-medium text-slate-600 block mb-2">Password</label>
                      <input
                        type="text"
                        placeholder="Leave empty to auto-generate"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-2">Minimum 8 characters, or leave blank to generate a secure one</p>
                    </div>
                  )}
                  <label className="mb-6 flex items-start gap-3 p-4 rounded-lg border border-emerald-200 bg-emerald-50/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.admin_access}
                      onChange={(e) => setFormData({ ...formData, admin_access: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded accent-emerald-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">Can sign in to the admin dashboard</span>
                      <span className="block text-xs text-slate-600 mt-0.5">
                        Gives full admin access. Leave off for staff who only need a record here (e.g. drivers).
                      </span>
                    </span>
                  </label>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-3">Select Permissions</label>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {PERMISSIONS.map(perm => (
                        <div key={perm.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                          <input
                            type="checkbox"
                            id={perm.value}
                            checked={formData.permissions.includes(perm.value)}
                            onChange={() => togglePermission(perm.value)}
                            className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                          />
                          <label htmlFor={perm.value} className="text-sm text-slate-700 cursor-pointer flex-1">{perm.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {formError && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{formError}</div>
          )}

          {/* Form Actions */}
          <div className="flex flex-wrap gap-3 items-center justify-between pt-6 border-t border-slate-200">
            <div className="flex gap-3">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                <FiChevronLeft className="w-4 h-4" />
                Previous
              </button>
              {currentStep < 3 && (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {draftSaved && (
                <span className="px-3 py-2.5 text-sm text-emerald-700 bg-emerald-50 rounded-lg">✓ Draft saved</span>
              )}
              <button
                onClick={saveDraft}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                <FiSave className="w-4 h-4" />
                Save Draft
              </button>
              {currentStep === 3 && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Create Account'}
                </button>
              )}
              <button
                onClick={closeForm}
                className="px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Table */}
      {loading ? (
        <AdminTableSkeleton rows={6} />
      ) : (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {staff.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-slate-600">No staff members found. Create one to get started.</p>
          </div>
        )}
        {staff.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Role</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Department</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-slate-50 transition">
                    <td className="px-6 py-3 text-slate-900 font-semibold">
                      {s.user_data?.first_name} {s.user_data?.last_name}
                      {s.admin_access && (
                        <span className="ml-2 align-middle px-2 py-0.5 bg-sky-50 text-sky-700 text-[11px] font-semibold rounded-full">Admin</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-sm">{s.role_display}</td>
                    <td className="px-6 py-3 text-slate-600 text-sm">{s.department_name}</td>
                    <td className="px-6 py-3 text-slate-600 text-sm">{s.user_data?.email}</td>
                    <td className="px-6 py-3">
                      {s.is_active ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-3"><div className="flex gap-1">
                      <button
                        onClick={() => openForm(s)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(s)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Reset Password"
                      >
                        <FiKey className="w-4 h-4" />
                      </button>
                      {s.is_active ? (
                        <button
                          onClick={() => handleDeactivate(s.id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="Deactivate"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(s.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Activate"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(s)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
