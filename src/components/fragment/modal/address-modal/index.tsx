import { useState } from "react";
import { useNotification } from "@/components/context/NotificationContext";
import { X, MapPin } from "lucide-react";

type AddressModalProps = {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const AddressModal = ({ userId, onClose, onSuccess }: AddressModalProps) => {
  const { showNotification } = useNotification();
  const [form, setForm] = useState({
    street: "",
    city: "",
    province: "",
    postal_code: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.street || !form.city || !form.province || !form.postal_code) {
      showNotification("Semua field harus diisi", "error");
      return;
    }

    setLoading(true);

    try {
      const stringUserId = String(userId);

      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_id: stringUserId,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        try {
          onSuccess();
          onClose();
          showNotification("Alamat berhasil ditambahkan!", "success");
        } catch (successError) {
          console.error("Error during success callback:", successError);
          showNotification(
            "Alamat tersimpan, tetapi gagal memperbarui tampilan. Silakan refresh halaman.",
            "info"
          );
        }
      } else {
        const msg = data.message || "Gagal menambahkan alamat";
        showNotification(msg, "error");
        console.error("Gagal menambahkan alamat:", data);
      }
    } catch (submitError) {
      console.error("Error submitting address:", submitError);
      showNotification("Terjadi kesalahan saat menambahkan alamat", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Tambah Alamat</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <input
              type="text"
              id="street"
              name="street"
              placeholder="Jl. Contoh No. 123"
              value={form.street}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Kota
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Semarang"
              value={form.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
              Provinsi
            </label>
            <input
              type="text"
              id="province"
              name="province"
              placeholder="Jawa Tengah"
              value={form.province}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
              Kode Pos
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              placeholder="50000"
              value={form.postal_code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              disabled={loading}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Simpan Alamat"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;