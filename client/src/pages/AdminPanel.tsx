import { useEffect, useState } from 'react'
import { adminService, authService } from '../services/api'
import toast from 'react-hot-toast'
import EditUserModal from '../components/Admin/EditUserModal'
import EditPropertyModal from '../components/Admin/EditPropertyModal'
import AddPropertyModal from '../components/Admin/AddPropertyModal'

export default function AdminPanel() {
  const [tab, setTab] = useState<'users' | 'properties' | 'settings'>('users')
  const [users, setUsers] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  })
  const [loading, setLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [addingProperty, setAddingProperty] = useState(false)

  useEffect(() => {
    fetchData()
  }, [tab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (tab === 'users') {
        const res = await adminService.getUsers()
        setUsers(res.data)
      } else if (tab === 'properties') {
        const res = await adminService.getProperties()
        setProperties(res.data)
      } else if (tab === 'settings') {
        const res = await adminService.getSettings()
        if (res.data) setSettings(res.data)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const toggleBlockUser = async (user: any) => {
    try {
      const res = await adminService.updateUser(user._id, { isBlocked: !user.isBlocked })
      setUsers((u) => u.map((x) => (x._id === user._id ? res.data : x)))
      toast.success(user.isBlocked ? 'User unblocked' : 'User blocked')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed')
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete user? This cannot be undone.')) return
    try {
      await adminService.deleteUser(id)
      setUsers((u) => u.filter((x) => x._id !== id))
      toast.success('User deleted')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Delete failed')
    }
  }

  const deleteProperty = async (id: string) => {
    if (!confirm('Delete property? This cannot be undone.')) return
    try {
      await adminService.deleteProperty(id)
      setProperties((p) => p.filter((x) => x._id !== id))
      toast.success('Property deleted')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Delete failed')
    }
  }

  const editUser = async (id: string, data: any) => {
    try {
      const res = await adminService.updateUser(id, data)
      setUsers((u) => u.map((x) => (x._id === id ? res.data : x)))
      setEditingUser(null)
      toast.success('User updated')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed')
    }
  }

  const editProperty = async (id: string, data: any) => {
    try {
      const res = await adminService.updateProperty(id, data)
      setProperties((list) => list.map((x) => (x._id === id ? res.data : x)))
      setEditingProperty(null)
      toast.success('Property updated')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed')
    }
  }

  const addProperty = async (data: any) => {
    try {
      const res = await adminService.createProperty(data)
      setProperties((list) => [...list, res.data])
      setAddingProperty(false)
      toast.success('Property created successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create property')
    }
  }

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminService.updateSettings(settings)
      setSettings(res.data)
      toast.success('Settings updated')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match')
    }
    setLoading(true)
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Users</button>
        <button onClick={() => setTab('properties')} className={`px-4 py-2 rounded ${tab === 'properties' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Properties</button>
        <button onClick={() => setTab('settings')} className={`px-4 py-2 rounded ${tab === 'settings' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>Settings</button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-gray-800">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Type</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t dark:border-gray-800">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.userType}</td>
                  <td className="p-3">{u.verified ? 'Yes' : 'No'}</td>
                  <td className="p-3">
                    {u.isBlocked ? (
                      <span className="text-red-500 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-500 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => setEditingUser(u)} className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500">Edit</button>
                    <button onClick={() => toggleBlockUser(u)} className={`px-3 py-1 rounded text-white ${u.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'properties' && (
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-4">
            <button onClick={() => setAddingProperty(true)} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Add New Property
            </button>
          </div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-gray-800">
                <th className="p-3">Title</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-t dark:border-gray-800">
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{p.owner?.name || p.owner}</td>
                  <td className="p-3">৳{p.price}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => setEditingProperty(p)} className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500">Edit</button>
                    <button onClick={() => deleteProperty(p._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'settings' && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Site Settings</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook || ''}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram || ''}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter (X) URL</label>
              <input
                type="url"
                value={settings.twitter || ''}
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={settings.linkedin || ''}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Settings
            </button>
          </form>

          <hr className="my-8 border-gray-200 dark:border-gray-800" />

          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={editUser}
        />
      )}

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSave={editProperty}
        />
      )}

      {addingProperty && (
        <AddPropertyModal
          onClose={() => setAddingProperty(false)}
          onSave={addProperty}
        />
      )}
    </div>
  )
}
