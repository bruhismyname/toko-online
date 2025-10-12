import { useState } from "react";

type AddressModalProps = {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const AddressModal = ({ userId, onClose, onSuccess }: AddressModalProps) => {
  const [form, setForm] = useState({
    street: "",
    city: "",
    province: "",
    postal_code: "",
  });
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const [error, setError] = useState<string | null>(null); // Tambahkan state error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validasi form
    if (!form.street || !form.city || !form.province || !form.postal_code) {
      setError("Semua field harus diisi");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Pastikan userId selalu string
      const stringUserId = String(userId);
      console.log("Submitting address with user ID:", stringUserId);

      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_id: stringUserId,
        }),
      });

      // Coba ambil respons JSON
      let data;
      try {
        data = await res.json();
      } catch (e) {
        // Jika tidak bisa parse JSON, gunakan objek kosong
        data = {};
      }

      if (res.ok) {
        // Panggil onSuccess dalam try-catch untuk menangani error
        try {
          onSuccess();
          onClose();
        } catch (successError) {
          console.error("Error during success callback:", successError);
          alert(
            "Alamat berhasil ditambahkan, tetapi gagal memperbarui tampilan. Silakan refresh halaman."
          );
        }
      } else {
        setError(data.message || "Gagal menambahkan alamat");
        console.error("Gagal menambahkan alamat:", data);
      }
    } catch (submitError) {
      console.error("Error submitting address:", submitError);
      setError("Terjadi kesalahan saat menambahkan alamat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Tambah Alamat</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          name="street"
          placeholder="Jalan"
          className="border p-2 mb-2 w-full rounded-md"
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Kota"
          className="border p-2 mb-2 w-full rounded-md"
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="text"
          name="province"
          placeholder="Provinsi"
          className="border p-2 mb-2 w-full rounded-md"
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="text"
          name="postal_code"
          placeholder="Kode Pos"
          className="border p-2 mb-4 w-full rounded-md"
          onChange={handleChange}
          disabled={loading}
          required
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded flex items-center`}
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
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
