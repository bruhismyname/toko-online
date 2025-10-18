import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pencil, Save, X, Plus, Trash2, User } from "lucide-react";
import AddressModal from "@/components/fragment/modal/address-modal";
import { useNotification } from "@/components/context/NotificationContext";

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

type Address = {
  id: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
};

const ProfileView = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/profile");

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/login");
            return;
          }
          throw new Error("Gagal memuat profil");
        }

        const data = await res.json();
        setUser(data.user);
        setAddresses(data.addresses || []);
        setFormData({ name: data.user.name });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Gagal memuat profil. Silakan coba lagi.");
        showNotification("Gagal memuat profil. Silakan coba lagi.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, showNotification]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal memperbarui profil");
      }

      const data = await res.json();
      setUser(data.user);
      setIsEditing(false);
      showNotification("Profil berhasil diperbarui!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Gagal memperbarui profil. Silakan coba lagi.");
      showNotification("Gagal memperbarui profil. Silakan coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Yakin ingin menghapus alamat ini?")) return;

    try {
      const res = await fetch(`/api/address/${addressId}`, { method: "DELETE" });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus alamat");
      }

      setAddresses(addresses.filter((addr) => addr.id !== addressId));
      showNotification("Alamat berhasil dihapus!", "success");
    } catch (error) {
      console.error("Error deleting address:", error);
      showNotification(
        `Gagal menghapus alamat: ${
          error instanceof Error ? error.message : "Kesalahan tidak diketahui"
        }`,
        "error"
      );
    }
  };

  const handleAddressSuccess = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
        showNotification("Alamat baru berhasil ditambahkan!", "success");
      }
    } catch (error) {
      console.error("Error refreshing addresses:", error);
      showNotification("Gagal memuat ulang daftar alamat.", "error");
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>

        {/* Profil Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Informasi Profil</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-sm text-gray-600 hover:text-black"
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user?.name || "" });
                }}
                className="flex items-center text-sm text-gray-600 hover:text-black"
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-500 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                      Menyimpan...
                    </span>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Alamat Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Alamat</h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center text-sm bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Alamat
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <User className="w-12 h-12 mb-2 opacity-30" />
              <p>Belum ada alamat tersimpan</p>
              <button
                onClick={() => setShowAddressModal(true)}
                className="mt-2 text-sm bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
              >
                Tambah alamat baru
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{address.street}</p>
                      <p className="text-sm text-gray-500">
                        {address.city}, {address.province}, {address.postal_code}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddressModal && user && (
        <AddressModal
          userId={user.id}
          onClose={() => setShowAddressModal(false)}
          onSuccess={handleAddressSuccess}
        />
      )}
    </div>
  );
};

export default ProfileView;