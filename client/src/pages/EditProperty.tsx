import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { propertyService } from '../services/api'
import toast from 'react-hot-toast'

export default function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    propertyType: 'flat',
    rentalType: 'rent',
    price: '',
    address: '',
    city: 'Dhaka',
    rooms: '',
    bathrooms: '',
    furnishing: 'unfurnished',
    sqft: '',
    floor: '',
    amenities: '',
  })
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [toDelete, setToDelete] = useState<Set<string>>(new Set())
  const [files, setFiles] = useState<FileList | null>(null)

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  const load = async () => {
    setLoading(true)
    try {
      const res = await propertyService.getById(id!)
      const p = res.data
      setFormData({
        title: p.title || '',
        description: p.description || '',
        propertyType: p.propertyType || 'flat',
        rentalType: p.rentalType || 'rent',
        price: p.price || '',
        address: p.location?.address || '',
        city: p.location?.city || 'Dhaka',
        rooms: p.rooms || '',
        bathrooms: p.bathrooms || '',
        furnishing: p.furnishing || 'unfurnished',
        sqft: p.sqft || '',
        floor: p.floor || '',
        amenities: p.amenities ? p.amenities.join(', ') : '',
      })
      setExistingImages(p.images || [])
    } catch (err: any) {
      toast.error('Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((f: any) => ({ ...f, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const toggleDelete = (img: string) => {
    setToDelete((s) => {
      const next = new Set(s)
      if (next.has(img)) next.delete(img)
      else next.add(img)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('propertyType', formData.propertyType)
      fd.append('rentalType', formData.rentalType)
      fd.append('price', String(formData.price))
      fd.append('location', JSON.stringify({ address: formData.address, city: formData.city, latitude: 0, longitude: 0 }))
      if (formData.rooms) fd.append('rooms', String(formData.rooms))
      if (formData.bathrooms) fd.append('bathrooms', String(formData.bathrooms))
      fd.append('furnishing', formData.furnishing)
      if (formData.sqft) fd.append('sqft', String(formData.sqft))
      fd.append('amenities', JSON.stringify(formData.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a)))

      if (files && files.length > 0) Array.from(files).forEach((f) => fd.append('images', f))

      if (toDelete.size > 0) fd.append('deletedImages', JSON.stringify(Array.from(toDelete)))

      await propertyService.update(id!, fd)
      toast.success('Property updated')
      navigate(`/property/${id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Edit Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="flex gap-2 mb-3">
              {existingImages.map((img) => (
                <div key={img} className="relative">
                  <img src={img} alt="existing" className="w-28 h-20 object-cover rounded" />
                  <label className={`absolute top-1 right-1 p-1 rounded ${toDelete.has(img) ? 'bg-red-500 text-white' : 'bg-white text-black'}`}>
                    <input type="checkbox" checked={toDelete.has(img)} onChange={() => toggleDelete(img)} />
                  </label>
                </div>
              ))}
            </div>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-500">Check existing images to remove them; new files will be appended.</p>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded">Save</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
