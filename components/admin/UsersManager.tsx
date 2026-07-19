'use client'

import { useState } from 'react'
import { User } from '@/lib/types'
import { isMockEnabled, mockUsers } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Users, ShieldAlert, Award, Shield, UserCheck, Key } from 'lucide-react'

interface UsersManagerProps {
  initialUsers: User[]
}

export default function UsersManager({ initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  const handleRoleChange = async (id: string, newRole: 'admin' | 'editor' | 'contributor') => {
    try {
      if (isMockEnabled()) {
        const updated = users.map(u => (u.id === id ? { ...u, role: newRole } : u))
        setUsers(updated)
        // Sync in mock
        const mockUserIndex = mockUsers.findIndex(u => u.id === id)
        if (mockUserIndex !== -1) mockUsers[mockUserIndex].role = newRole
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', id)

      if (error) {
        alert('Failed to update user role: ' + error.message)
      } else {
        setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
      case 'editor':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
          Staff Directory & Roles
        </h1>
        <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
          Modify clearance levels and manage access permissions for editorial teams
        </p>
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Access Clearance</th>
                <th className="px-6 py-4 text-right">Alter Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                  {/* Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt={u.full_name} className="w-9 h-9 rounded-full object-cover border border-amber/40 shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-amber/20 text-amber font-bold flex items-center justify-center font-mono uppercase shrink-0">
                          {u.full_name[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-ink-navy dark:text-paper-warm block">
                          {u.full_name}
                        </span>
                        <span className="text-[10px] font-mono text-ink-navy/40 dark:text-gray-500 uppercase">
                          ID: {u.id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 font-mono text-ink-navy/70 dark:text-gray-400">
                    {u.email}
                  </td>

                  {/* Role Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${getRoleBadge(u.role)}`}>
                      {u.role === 'admin' ? (
                        <Shield className="w-3 h-3" />
                      ) : u.role === 'editor' ? (
                        <Award className="w-3 h-3" />
                      ) : (
                        <UserCheck className="w-3 h-3" />
                      )}
                      <span>{u.role}</span>
                    </span>
                  </td>

                  {/* Alter Access */}
                  <td className="px-6 py-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="text-xs bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded px-2.5 py-1 text-ink-navy dark:text-paper-warm outline-none focus:border-amber"
                    >
                      <option value="admin">Administrator</option>
                      <option value="editor">Editor</option>
                      <option value="contributor">Contributor</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
