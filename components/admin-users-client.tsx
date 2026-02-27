"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  bannedAt: string | null
  listingsCount: number
}

export function AdminUsersClient({ users }: { users: User[] }) {
  const router = useRouter()

  async function ban(id: string) {
    await fetch(`/api/admin/users/${id}/ban`, { method: "POST" })
    router.refresh()
  }

  async function unban(id: string) {
    await fetch(`/api/admin/users/${id}/unban`, { method: "POST" })
    router.refresh()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">Email</th>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Role</th>
            <th className="text-left py-2">Listings</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border">
              <td className="py-2">{u.email}</td>
              <td className="py-2">{u.name ?? "—"}</td>
              <td className="py-2">{u.role}</td>
              <td className="py-2">{u.listingsCount}</td>
              <td className="py-2">{u.bannedAt ? "Banned" : "Active"}</td>
              <td className="py-2">
                {u.bannedAt ? (
                  <Button variant="outline" size="sm" onClick={() => unban(u.id)}>
                    Unban
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => ban(u.id)}>
                    Ban
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
