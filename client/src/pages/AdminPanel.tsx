import React, { useEffect, useState } from 'react'
import { adminService } from '../services/api'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const [tab, setTab] = useState<'users' | 'properties'>('users')
  const [users, setUsers] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [tab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (tab === 'users') {
        const res = await adminService.getUsers()
        setUsers(res.data)
      } else {
        const res = await adminService.getProperties()
        setProperties(res.data)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to load')
    } finally {
      setLoading(false)
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

  const editUser = async (user: any) => {
    const name = prompt('Name', user.name)
    if (name === null) return
    const userType = prompt('User type (owner/tenant/admin)', user.userType) || user.userType
    const verified = confirm('Mark verified?')
    try {
      const res = await adminService.updateUser(user._id, { name, userType, verified })
      setUsers((u) => u.map((x) => (x._id === user._id ? res.data : x)))
      toast.success('User updated')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed')
    }
  }

  const editProperty = async (p: any) => {
    const title = prompt('Title', p.title)
    if (title === null) return
    try {
      const res = await adminService.updateProperty(p._id, { title })
      setProperties((list) => list.map((x) => (x._id === p._id ? res.data : x)))
      toast.success('Property updated')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}>Users</button>
        <button onClick={() => setTab('properties')} className={`px-4 py-2 rounded ${tab === 'properties' ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}>Properties</button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && tab === 'users' && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Type</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.userType}</td>
                <td className="p-2">{u.verified ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <button onClick={() => editUser(u)} className="mr-2 px-2 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => deleteUser(u._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && tab === 'properties' && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Owner</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.owner?.name || p.owner}</td>
                <td className="p-2">{p.price}</td>
                <td className="p-2">
                  <button onClick={() => editProperty(p)} className="mr-2 px-2 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => deleteProperty(p._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
