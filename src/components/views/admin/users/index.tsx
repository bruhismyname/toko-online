import { useEffect, useState } from "react";
import AdminLayout from "../layout";
import { Users, Shield, Mail, Trash2, Check } from "lucide-react";
import { useNotification } from "@/components/context/NotificationContext";

const AdminUserView = () => {
  const { showNotification, showConfirm } = useNotification(); // ✅ pakai context
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Ambil semua user
  const getAllUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        showNotification("Gagal mengambil data user", "error");
        return [];
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      showNotification("Terjadi kesalahan saat memuat data user", "error");
      return [];
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      if (data) {
        setUsers(data);
        const roleState: any = {};
        data.forEach((u: any) => (roleState[u.id] = u.role));
        setSelectedRoles(roleState);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Ganti role
  const handleSelectChange = (userId: string, newRole: string) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleUpdateRole = async (userId: string) => {
    const newRole = selectedRoles[userId];
    const user = users.find((u) => u.id === userId);

    if (!user) return;
    if (user.role === newRole) {
      showNotification("Role tidak ada perubahan", "info");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        const updatedUsers = users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        );
        setUsers(updatedUsers);
        showNotification(`Role user berhasil diubah menjadi "${newRole}"`, "success");
      } else {
        showNotification("Gagal mengubah role user", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Terjadi kesalahan saat mengubah role", "error");
    }
  };

  // Hapus user dengan konfirmasi
  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    showConfirm(`Yakin ingin menghapus user "${user.name}"?`, async () => {
      try {
        const res = await fetch(`/api/admin/users?userId=${userId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          setUsers(users.filter((u) => u.id !== userId));
          showNotification("User berhasil dihapus", "success");
        } else {
          showNotification("Gagal menghapus user", "error");
        }
      } catch (error) {
        console.error(error);
        showNotification("Terjadi kesalahan saat menghapus user", "error");
      }
    });
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
          </div>
          <p className="text-gray-600">Kelola role dan data pengguna sistem</p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total User</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Admin</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <Shield className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Regular User</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "user").length}
                </p>
              </div>
              <Users className="h-10 w-10 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        {users.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Belum ada data user</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">ID: {String(user.id).slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRoles[user.id]}
                            onChange={(e) => handleSelectChange(user.id, e.target.value)}
                            className="border-2 border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                          >
                            <option value="user">👤 User</option>
                            <option value="admin">🛡️ Admin</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(user.id)}
                            className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-1"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 font-semibold transition flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-sm">Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserView;
