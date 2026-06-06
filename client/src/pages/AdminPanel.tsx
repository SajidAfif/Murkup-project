import { useState, useMemo } from 'react'
import {
  Users, Building2, Settings, LayoutDashboard, Shield, Search,
  UserCheck, UserX, Ban, Trash2, Pencil, Plus, X, Save,
  Eye, ChevronDown, TrendingUp, Home, CheckCircle2, XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Hardcoded Data ────────────────────────────────────────────

const INITIAL_USERS = [
  { _id: 'u1', name: 'System Admin', email: 'sajidmortujaafif0@gmail.com', phone: '01700000001', nid: '1234567890', userType: 'admin' as const, verified: true, isBlocked: false, createdAt: '2024-01-01' },
  { _id: 'u2', name: 'John Tenant', email: 'tenant@example.com', phone: '01700000002', nid: '2345678901', userType: 'tenant' as const, verified: true, isBlocked: false, createdAt: '2024-02-15' },
  { _id: 'u3', name: 'Jane Owner', email: 'owner@example.com', phone: '01700000003', nid: '3456789012', userType: 'owner' as const, verified: true, isBlocked: false, createdAt: '2024-03-10' },
  { _id: 'u4', name: 'Rahim Uddin', email: 'rahim@example.com', phone: '01700000004', nid: '4567890123', userType: 'tenant' as const, verified: false, isBlocked: false, createdAt: '2024-04-20' },
  { _id: 'u5', name: 'Karim Hossain', email: 'karim@example.com', phone: '01700000005', nid: '5678901234', userType: 'owner' as const, verified: true, isBlocked: true, createdAt: '2024-05-05' },
  { _id: 'u6', name: 'Fatema Akter', email: 'fatema@example.com', phone: '01700000006', nid: '6789012345', userType: 'tenant' as const, verified: true, isBlocked: false, createdAt: '2024-06-12' },
  { _id: 'u7', name: 'Nusrat Jahan', email: 'nusrat@example.com', phone: '01700000007', nid: '7890123456', userType: 'owner' as const, verified: false, isBlocked: false, createdAt: '2024-07-01' },
]

const INITIAL_PROPERTIES = [
  { _id: 'p1', title: '3 BHK Luxury Flat in Gulshan', description: 'Beautiful flat with modern amenities in the heart of Gulshan.', owner: { _id: 'u3', name: 'Jane Owner' }, price: 35000, propertyType: 'flat' as const, rentalType: 'rent' as const, rooms: 3, bathrooms: 2, sqft: 1500, furnishing: 'furnished' as const, available: true, location: { address: 'Road 12, Gulshan 1', city: 'Dhaka' }, createdAt: '2024-06-01' },
  { _id: 'p2', title: 'Office Space in Motijheel', description: 'Prime commercial space suitable for small business.', owner: { _id: 'u5', name: 'Karim Hossain' }, price: 50000, propertyType: 'office' as const, rentalType: 'rent' as const, rooms: 4, bathrooms: 1, sqft: 2000, furnishing: 'semi-furnished' as const, available: true, location: { address: 'DIT Extension Rd, Motijheel', city: 'Dhaka' }, createdAt: '2024-06-15' },
  { _id: 'p3', title: 'Single Room in Dhanmondi', description: 'Affordable room near university campus. Ideal for students.', owner: { _id: 'u3', name: 'Jane Owner' }, price: 8000, propertyType: 'room' as const, rentalType: 'sublet' as const, rooms: 1, bathrooms: 1, sqft: 250, furnishing: 'unfurnished' as const, available: false, location: { address: 'Road 27, Dhanmondi', city: 'Dhaka' }, createdAt: '2024-07-01' },
  { _id: 'p4', title: '2 BHK Apartment in Uttara', description: 'Spacious 2 bedroom apartment with parking, garden, and gas.', owner: { _id: 'u7', name: 'Nusrat Jahan' }, price: 18000, propertyType: 'flat' as const, rentalType: 'rent' as const, rooms: 2, bathrooms: 1, sqft: 1000, furnishing: 'semi-furnished' as const, available: true, location: { address: 'Sector 7, Uttara', city: 'Dhaka' }, createdAt: '2024-07-10' },
  { _id: 'p5', title: 'Shop Space in Banani', description: 'High-traffic commercial shop for retail business.', owner: { _id: 'u5', name: 'Karim Hossain' }, price: 40000, propertyType: 'shop' as const, rentalType: 'rent' as const, rooms: 1, bathrooms: 1, sqft: 500, furnishing: 'unfurnished' as const, available: true, location: { address: 'Road 11, Banani', city: 'Dhaka' }, createdAt: '2024-08-01' },
]

type TabType = 'dashboard' | 'users' | 'properties' | 'settings'

// ─── Dashboard Stats Card ──────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: number | string; color: string; sub?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5`}>
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 ${color}`} />
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Panel ──────────────────────────────────────────

export default function AdminPanel() {
  const [tab, setTab] = useState<TabType>('dashboard')
  const [users, setUsers] = useState(INITIAL_USERS)
  const [properties, setProperties] = useState(INITIAL_PROPERTIES)
  const [settings, setSettings] = useState({ facebook: 'https://facebook.com/tolet', instagram: 'https://instagram.com/tolet', twitter: 'https://x.com/tolet', linkedin: 'https://linkedin.com/company/tolet' })
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [addingProperty, setAddingProperty] = useState(false)

  // ── Stats ─────────────────────────────────
  const stats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter(u => !u.isBlocked).length
    const blockedUsers = users.filter(u => u.isBlocked).length
    const verifiedUsers = users.filter(u => u.verified).length
    const totalProperties = properties.length
    const availableProperties = properties.filter(p => p.available).length
    const owners = users.filter(u => u.userType === 'owner').length
    const tenants = users.filter(u => u.userType === 'tenant').length
    return { totalUsers, activeUsers, blockedUsers, verifiedUsers, totalProperties, availableProperties, owners, tenants }
  }, [users, properties])

  // ── User Actions ──────────────────────────
  const toggleBlockUser = (user: any) => {
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u))
    toast.success(user.isBlocked ? `${user.name} unblocked` : `${user.name} blocked`)
  }

  const deleteUser = (id: string) => {
    if (!confirm('Delete user? This cannot be undone.')) return
    const user = users.find(u => u._id === id)
    setUsers(prev => prev.filter(u => u._id !== id))
    toast.success(`${user?.name || 'User'} deleted`)
  }

  const saveUser = (id: string, data: any) => {
    setUsers(prev => prev.map(u => u._id === id ? { ...u, ...data } : u))
    setEditingUser(null)
    toast.success('User updated successfully')
  }

  // ── Property Actions ──────────────────────
  const deleteProperty = (id: string) => {
    if (!confirm('Delete property? This cannot be undone.')) return
    const prop = properties.find(p => p._id === id)
    setProperties(prev => prev.filter(p => p._id !== id))
    toast.success(`"${prop?.title || 'Property'}" deleted`)
  }

  const saveProperty = (id: string, data: any) => {
    setProperties(prev => prev.map(p => p._id === id ? { ...p, ...data } : p))
    setEditingProperty(null)
    toast.success('Property updated successfully')
  }

  const addProperty = (data: any) => {
    const ownerUser = users.find(u => u._id === data.ownerId)
    const newProp = {
      ...data,
      _id: 'p' + Date.now(),
      owner: { _id: data.ownerId, name: ownerUser?.name || 'Unknown' },
      location: { address: 'New Address', city: 'Dhaka' },
      createdAt: new Date().toISOString().split('T')[0],
    }
    setProperties(prev => [...prev, newProp])
    setAddingProperty(false)
    toast.success('Property created successfully')
  }

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Settings saved successfully')
  }

  // ── Filtering ─────────────────────────────
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ── Sidebar items ─────────────────────────
  const sidebarItems: { id: TabType; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">To-LET</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSearchQuery('') }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === item.id
                  ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">SA</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">System Admin</p>
              <p className="text-xs text-gray-400 truncate">sajidmortujaafif0@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold capitalize">{tab}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {tab === 'dashboard' && 'Overview of your platform'}
              {tab === 'users' && `${users.length} total users registered`}
              {tab === 'properties' && `${properties.length} total properties listed`}
              {tab === 'settings' && 'Manage site configuration'}
            </p>
          </div>
          {(tab === 'users' || tab === 'properties') && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-violet-500 outline-none w-64 transition-all"
                />
              </div>
              {tab === 'properties' && (
                <button onClick={() => setAddingProperty(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                  <Plus className="w-4 h-4" /> Add Property
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Dashboard Tab ── */}
        {tab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-violet-500" sub={`${stats.activeUsers} active`} />
              <StatCard icon={Building2} label="Total Properties" value={stats.totalProperties} color="bg-emerald-500" sub={`${stats.availableProperties} available`} />
              <StatCard icon={UserCheck} label="Verified Users" value={stats.verifiedUsers} color="bg-sky-500" sub={`${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% of total`} />
              <StatCard icon={Ban} label="Blocked Users" value={stats.blockedUsers} color="bg-rose-500" sub={stats.blockedUsers === 0 ? 'All clear!' : 'Requires attention'} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Users</h3>
                  <button onClick={() => setTab('users')} className="text-sm text-violet-500 hover:text-violet-600">View All →</button>
                </div>
                <div className="space-y-3">
                  {users.slice(-4).reverse().map(u => (
                    <div key={u._id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${u.userType === 'admin' ? 'bg-violet-500' : u.userType === 'owner' ? 'bg-emerald-500' : 'bg-sky-500'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.userType === 'admin' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' : u.userType === 'owner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'}`}>
                        {u.userType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Properties */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Properties</h3>
                  <button onClick={() => setTab('properties')} className="text-sm text-violet-500 hover:text-violet-600">View All →</button>
                </div>
                <div className="space-y-3">
                  {properties.slice(-4).reverse().map(p => (
                    <div key={p._id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                          <Home className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.owner.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">৳{p.price.toLocaleString()}</p>
                        <p className={`text-xs ${p.available ? 'text-green-500' : 'text-red-400'}`}>{p.available ? 'Available' : 'Unavailable'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Home} label="Owners" value={stats.owners} color="bg-amber-500" />
              <StatCard icon={Users} label="Tenants" value={stats.tenants} color="bg-cyan-500" />
              <StatCard icon={TrendingUp} label="Avg. Rent" value={`৳${Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length).toLocaleString()}`} color="bg-pink-500" />
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">NID</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verified</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${u.userType === 'admin' ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : u.userType === 'owner' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-sky-500 to-blue-600'}`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.userType === 'admin' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' : u.userType === 'owner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'}`}>
                          {u.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.nid || '—'}</td>
                      <td className="px-6 py-4">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <XCircle className="w-3 h-3" /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.verified ? (
                          <UserCheck className="w-5 h-5 text-green-500" />
                        ) : (
                          <UserX className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingUser(u)} className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => toggleBlockUser(u)} className={`p-2 rounded-lg transition-colors ${u.isBlocked ? 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500' : 'hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-500'}`} title={u.isBlocked ? 'Unblock' : 'Block'}>
                            <Ban className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteUser(u._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Properties Tab ── */}
        {tab === 'properties' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {filteredProperties.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-violet-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium max-w-[220px] truncate">{p.title}</p>
                            <p className="text-xs text-gray-400">{p.location?.city} • {p.sqft} sqft • {p.rooms} rooms</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{p.owner?.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 capitalize">{p.propertyType}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">৳{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {p.available ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <XCircle className="w-3 h-3" /> Unavailable
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingProperty(p)} className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProperty(p._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProperties.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No properties found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {tab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
              <h3 className="text-lg font-semibold mb-6">Social Media Links</h3>
              <form onSubmit={handleSettingsSave} className="space-y-5">
                {[
                  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
                  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
                  { key: 'twitter', label: 'Twitter (X) URL', placeholder: 'https://x.com/...' },
                  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
                    <input
                      type="url"
                      value={(settings as any)[field.key] || ''}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
              <h3 className="text-lg font-semibold mb-6">Change Password</h3>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('Password changed successfully') }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Current Password</label>
                  <input type="password" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                  <input type="password" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Confirm New Password</label>
                  <input type="password" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm" />
                </div>
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── Edit User Modal ── */}
      {editingUser && (
        <ModalOverlay onClose={() => setEditingUser(null)}>
          <h2 className="text-xl font-bold mb-6">Edit User</h2>
          <EditUserForm user={editingUser} onSave={saveUser} onClose={() => setEditingUser(null)} />
        </ModalOverlay>
      )}

      {/* ── Edit Property Modal ── */}
      {editingProperty && (
        <ModalOverlay onClose={() => setEditingProperty(null)}>
          <h2 className="text-xl font-bold mb-6">Edit Property</h2>
          <EditPropertyForm property={editingProperty} onSave={saveProperty} onClose={() => setEditingProperty(null)} />
        </ModalOverlay>
      )}

      {/* ── Add Property Modal ── */}
      {addingProperty && (
        <ModalOverlay onClose={() => setAddingProperty(false)}>
          <h2 className="text-xl font-bold mb-6">Add New Property</h2>
          <AddPropertyForm users={users} onSave={addProperty} onClose={() => setAddingProperty(false)} />
        </ModalOverlay>
      )}
    </div>
  )
}

// ─── Reusable Modal Overlay ────────────────────────────────────

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800 my-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}

// ─── Edit User Form ────────────────────────────────────────────

function EditUserForm({ user, onSave, onClose }: { user: any; onSave: (id: string, data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone || '', nid: user.nid || '', userType: user.userType, verified: user.verified, isBlocked: user.isBlocked })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(user._id, form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
      <InputField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
      <InputField label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
      <InputField label="NID" value={form.nid} onChange={v => setForm({ ...form, nid: v })} />
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">User Type</label>
        <select value={form.userType} onChange={e => setForm({ ...form, userType: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none text-sm">
          <option value="tenant">Tenant</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.verified} onChange={e => setForm({ ...form, verified: e.target.checked })} className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500" />
          <span>Verified</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer text-red-500">
          <input type="checkbox" checked={form.isBlocked} onChange={e => setForm({ ...form, isBlocked: e.target.checked })} className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
          <span>Blocked</span>
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">Save Changes</button>
      </div>
    </form>
  )
}

// ─── Edit Property Form ────────────────────────────────────────

function EditPropertyForm({ property, onSave, onClose }: { property: any; onSave: (id: string, data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: property.title, description: property.description, price: property.price,
    propertyType: property.propertyType, rentalType: property.rentalType,
    rooms: property.rooms, bathrooms: property.bathrooms, sqft: property.sqft,
    furnishing: property.furnishing, available: property.available,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(property._id, form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} required />
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
        <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Price (৳)" type="number" value={String(form.price)} onChange={v => setForm({ ...form, price: Number(v) })} required />
        <InputField label="Size (sqft)" type="number" value={String(form.sqft)} onChange={v => setForm({ ...form, sqft: Number(v) })} />
        <SelectField label="Property Type" value={form.propertyType} options={['flat','room','office','shop','hostel']} onChange={v => setForm({ ...form, propertyType: v })} />
        <SelectField label="Rental Type" value={form.rentalType} options={['rent','sale','sublet']} onChange={v => setForm({ ...form, rentalType: v })} />
        <InputField label="Rooms" type="number" value={String(form.rooms)} onChange={v => setForm({ ...form, rooms: Number(v) })} />
        <InputField label="Bathrooms" type="number" value={String(form.bathrooms)} onChange={v => setForm({ ...form, bathrooms: Number(v) })} />
      </div>
      <SelectField label="Furnishing" value={form.furnishing} options={['unfurnished','semi-furnished','furnished']} onChange={v => setForm({ ...form, furnishing: v })} />
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500" />
        <span>Currently Available</span>
      </label>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">Save Changes</button>
      </div>
    </form>
  )
}

// ─── Add Property Form ─────────────────────────────────────────

function AddPropertyForm({ users, onSave, onClose }: { users: any[]; onSave: (data: any) => void; onClose: () => void }) {
  const owners = users.filter(u => u.userType === 'owner' || u.userType === 'admin')
  const [form, setForm] = useState({
    title: '', description: '', price: 0, propertyType: 'flat', rentalType: 'rent',
    rooms: 1, bathrooms: 1, sqft: 0, furnishing: 'unfurnished', available: true,
    ownerId: owners.length > 0 ? owners[0]._id : '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.ownerId) { toast.error('Please select an owner'); return }
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Owner</label>
        <select value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none text-sm" required>
          <option value="">-- Select Owner --</option>
          {owners.map(o => <option key={o._id} value={o._id}>{o.name} ({o.email})</option>)}
        </select>
      </div>
      <InputField label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} required />
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
        <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Price (৳)" type="number" value={String(form.price)} onChange={v => setForm({ ...form, price: Number(v) })} required />
        <InputField label="Size (sqft)" type="number" value={String(form.sqft)} onChange={v => setForm({ ...form, sqft: Number(v) })} />
        <SelectField label="Property Type" value={form.propertyType} options={['flat','room','office','shop','hostel']} onChange={v => setForm({ ...form, propertyType: v })} />
        <SelectField label="Rental Type" value={form.rentalType} options={['rent','sale','sublet']} onChange={v => setForm({ ...form, rentalType: v })} />
        <InputField label="Rooms" type="number" value={String(form.rooms)} onChange={v => setForm({ ...form, rooms: Number(v) })} />
        <InputField label="Bathrooms" type="number" value={String(form.bathrooms)} onChange={v => setForm({ ...form, bathrooms: Number(v) })} />
      </div>
      <SelectField label="Furnishing" value={form.furnishing} options={['unfurnished','semi-furnished','furnished']} onChange={v => setForm({ ...form, furnishing: v })} />
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500" />
        <span>Currently Available</span>
      </label>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">Create Property</button>
      </div>
    </form>
  )
}

// ─── Shared Field Components ───────────────────────────────────

function InputField({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none text-sm transition-all" />
    </div>
  )
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 outline-none text-sm capitalize transition-all">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
