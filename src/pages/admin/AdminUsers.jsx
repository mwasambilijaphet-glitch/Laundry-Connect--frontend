import { useState, useEffect } from 'react';
import { apiAdminGetUsers, apiAdminUpdateUser, apiAdminDeleteUser } from '../../api/client';
import { Loader2, Users, Store, Shield, Search, Pencil, Trash2, X, Check, AlertTriangle, Ban, ShieldOff, ShieldCheck } from 'lucide-react';

const ROLE_FILTERS = [
  { value: '', label: 'All Users', icon: Users },
  { value: 'customer', label: 'Customers', icon: Users },
  { value: 'owner', label: 'Shop Owners', icon: Store },
  { value: 'admin', label: 'Admins', icon: Shield },
];

const ROLES = ['customer', 'owner', 'admin'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status change
  const [statusLoading, setStatusLoading] = useState(null);

  // Toast
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await apiAdminGetUsers(filter || undefined);
      setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  // ── Edit handlers ──────────────────────────────────────
  function startEdit(user) {
    setEditingId(user.id);
    setEditForm({
      full_name: user.full_name,
      phone: user.phone,
      email: user.email || '',
      role: user.role,
      is_verified: user.is_verified,
    });
    setEditError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
    setEditError('');
  }

  async function saveEdit() {
    if (!editForm.full_name?.trim()) {
      setEditError('Name is required');
      return;
    }
    try {
      setEditSaving(true);
      setEditError('');
      const data = await apiAdminUpdateUser(editingId, editForm);
      setUsers(prev => prev.map(u => u.id === editingId ? data.user : u));
      setEditingId(null);
      showToast('User updated successfully');
    } catch (err) {
      setEditError(err.message || 'Failed to update user');
    } finally {
      setEditSaving(false);
    }
  }

  // ── Delete handlers ────────────────────────────────────
  async function confirmDelete() {
    try {
      setDeleting(true);
      await apiAdminDeleteUser(deleteConfirm.id);
      setUsers(prev => prev.filter(u => u.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      showToast('User deleted');
    } catch (err) {
      showToast(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  }

  // ── Status change handler ───────────────────────────────
  async function changeStatus(userId, newStatus) {
    try {
      setStatusLoading(userId);
      const data = await apiAdminUpdateUser(userId, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
      const labels = { active: 'activated', suspended: 'suspended', blocked: 'blocked' };
      showToast(`User ${labels[newStatus]}`);
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(null);
    }
  }

  const filtered = search
    ? users.filter(u =>
        (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search)
      )
    : users;

  const roleBadge = (role) => {
    if (role === 'admin') return 'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (role === 'owner') return 'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    return 'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
  };

  const roleIcon = (role) => {
    if (role === 'admin') return '🛡️';
    if (role === 'owner') return '🏪';
    return '👤';
  };

  const statusBadge = (status) => {
    if (status === 'blocked') return 'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (status === 'suspended') return 'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return '';
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-primary-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">Delete User</h3>
                <p className="text-xs text-slate-500">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
              Are you sure you want to delete <strong>{deleteConfirm.full_name}</strong>?
            </p>
            <p className="text-xs text-slate-400 mb-6">
              All their orders, shops, and data will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display">User Management</h1>
        <p className="text-slate-500 text-sm">{users.length} users total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ROLE_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.value
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <f.icon size={13} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="text-primary-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">👥</p>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No users found</h3>
          <p className="text-slate-500 text-sm">{search ? 'Try a different search' : 'No users match this filter'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(user => (
            <div key={user.id} className="card p-4">
              {editingId === user.id ? (
                /* ── Edit mode ────────────────────────── */
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Edit User</h3>
                    <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                      <select
                        value={editForm.role}
                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                        className="input-field text-sm"
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.is_verified}
                        onChange={e => setEditForm({ ...editForm, is_verified: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      Verified
                    </label>
                  </div>

                  {editError && (
                    <p className="text-xs text-red-500">{editError}</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      disabled={editSaving}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {editSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Display mode ─────────────────────── */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      {roleIcon(user.role)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{user.full_name}</p>
                        <span className={roleBadge(user.role)}>{user.role}</span>
                        {user.is_verified
                          ? <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">✓</span>
                          : <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">✗</span>
                        }
                        {(user.status === 'suspended' || user.status === 'blocked') && (
                          <span className={statusBadge(user.status)}>
                            {user.status === 'blocked' ? '⛔ Blocked' : '⏸ Suspended'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{user.phone}</span>
                        {user.email && <span className="hidden sm:inline">• {user.email}</span>}
                        <span className="hidden sm:inline">• {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {/* Status actions */}
                    {(!user.status || user.status === 'active') ? (
                      <>
                        <button
                          onClick={() => changeStatus(user.id, 'suspended')}
                          disabled={statusLoading === user.id}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                          title="Suspend user"
                        >
                          {statusLoading === user.id ? <Loader2 size={15} className="animate-spin" /> : <ShieldOff size={15} />}
                        </button>
                        <button
                          onClick={() => changeStatus(user.id, 'blocked')}
                          disabled={statusLoading === user.id}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          title="Block user"
                        >
                          <Ban size={15} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => changeStatus(user.id, 'active')}
                        disabled={statusLoading === user.id}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                        title="Activate user"
                      >
                        {statusLoading === user.id ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(user)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                      title="Edit user"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
