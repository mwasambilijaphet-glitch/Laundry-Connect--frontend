import { useState, useEffect } from 'react';
import { apiAdminGetUsers } from '../../api/client';
import { Loader2, Users, Store, Shield, Search } from 'lucide-react';

const ROLE_FILTERS = [
  { value: '', label: 'All Users', icon: Users },
  { value: 'customer', label: 'Customers', icon: Users },
  { value: 'owner', label: 'Shop Owners', icon: Store },
  { value: 'admin', label: 'Admins', icon: Shield },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const data = await apiAdminGetUsers(filter || undefined);
        setUsers(data.users);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, [filter]);

  const filtered = search
    ? users.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search)
      )
    : users;

  const roleBadge = (role) => {
    if (role === 'admin') return 'badge text-[10px] bg-red-100 text-red-700';
    if (role === 'owner') return 'badge text-[10px] bg-purple-100 text-purple-700';
    return 'badge text-[10px] bg-primary-100 text-primary-700';
  };

  const roleIcon = (role) => {
    if (role === 'admin') return '🛡️';
    if (role === 'owner') return '🏪';
    return '👤';
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">User Management</h1>
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
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
          <h3 className="text-lg font-bold text-slate-800 mb-1">No users found</h3>
          <p className="text-slate-500 text-sm">{search ? 'Try a different search' : 'No users match this filter'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Verified</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                          {roleIcon(user.role)}
                        </div>
                        <span className="font-medium text-slate-800">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={roleBadge(user.role)}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      {user.is_verified
                        ? <span className="badge-green text-[10px]">✓ Yes</span>
                        : <span className="badge-red text-[10px]">✗ No</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-50">
            {filtered.map(user => (
              <div key={user.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                      {roleIcon(user.role)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{user.full_name}</p>
                      <p className="text-xs text-slate-400">{user.phone}</p>
                    </div>
                  </div>
                  <span className={roleBadge(user.role)}>{user.role}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{user.email}</span>
                  <span>{new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}