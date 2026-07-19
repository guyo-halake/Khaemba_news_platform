'use client'

import { useState } from 'react'
import { Category } from '@/lib/types'
import { isMockEnabled, addCategory, editCategory, deleteCategory } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'

interface CategoriesManagerProps {
  initialCategories: Category[]
  tenantId?: string
}

export default function CategoriesManager({ initialCategories, tenantId }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [accentColor, setAccentColor] = useState('#B23A3A')

  const resetForm = () => {
    setName('')
    setSlug('')
    setAccentColor('#B23A3A')
    setEditingCategory(null)
    setIsFormOpen(false)
  }

  const handleOpenNew = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setAccentColor(cat.accent_color)
    setIsFormOpen(true)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!editingCategory) {
      // Auto-slugify
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug || !accentColor) {
      alert('Please fill in all fields.')
      return
    }

    const payload = {
      name,
      slug,
      accent_color: accentColor,
      tenant_id: tenantId || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'
    }

    try {
      if (isMockEnabled()) {
        if (editingCategory) {
          await editCategory(editingCategory.id, payload)
          setCategories(
            categories.map(c => (c.id === editingCategory.id ? { ...c, ...payload } : c))
          )
        } else {
          const newCat = await addCategory(payload)
          setCategories([...categories, newCat])
        }
        resetForm()
        return
      }

      // Supabase Pipeline
      const supabase = createClient()
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id)
        if (error) throw error
        setCategories(
          categories.map(c => (c.id === editingCategory.id ? { ...c, ...payload } : c))
        )
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        if (data) {
          setCategories([...categories, data as Category])
        }
      }
      resetForm()
    } catch (err: any) {
      console.error(err)
      alert('Failed to save category: ' + (err.message || err))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Articles under it will become unassigned.')) return

    try {
      if (isMockEnabled()) {
        await deleteCategory(id)
        setCategories(categories.filter(c => c.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      setCategories(categories.filter(c => c.id !== id))
    } catch (err: any) {
      console.error(err)
      alert('Failed to delete category: ' + (err.message || err))
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
            News Categories
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
            Configure editorial categories and colors
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table View */}
        <div className={`lg:col-span-8 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Accent Color</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/80 text-xs">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-550">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                      <td className="px-6 py-4 font-headline font-bold text-ink-navy dark:text-paper-warm">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                            style={{ backgroundColor: cat.accent_color }}
                          />
                          <span className="font-mono text-[10px] uppercase text-ink-navy/60 dark:text-gray-400">
                            {cat.accent_color}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 hover:bg-amber/15 text-ink-navy/60 dark:text-gray-400 hover:text-amber rounded transition-colors"
                            title="Edit Category"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Form Panel */}
        {isFormOpen && (
          <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
              <h3 className="font-headline font-black text-sm text-ink-navy dark:text-white uppercase tracking-wider">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                onClick={resetForm}
                className="text-ink-navy/40 hover:text-ink-navy dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Investigations"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full text-xs px-3 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="investigations"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">
                  Accent Color (Hex)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 border border-ink-navy/10 rounded cursor-pointer p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    required
                    maxLength={7}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#B23A3A"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-grow text-xs px-3 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-ink-navy/10 dark:border-gray-700 hover:bg-paper-warm/30 rounded text-xs text-ink-navy dark:text-gray-300 font-mono font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber hover:bg-amber-hover text-ink-navy rounded text-xs font-bold uppercase transition-colors flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
