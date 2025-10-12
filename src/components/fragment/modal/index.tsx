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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, user_id: userId }),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      console.error("Gagal menambahkan alamat");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Tambah Alamat</h2>
        <input
          type="text"
          name="street"
          placeholder="Jalan"
          className="border p-2 mb-2 w-full"
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="Kota"
          className="border p-2 mb-2 w-full"
          onChange={handleChange}
        />
        <input
          type="text"
          name="province"
          placeholder="Provinsi"
          className="border p-2 mb-2 w-full"
          onChange={handleChange}
        />
        <input
          type="text"
          name="postal_code"
          placeholder="Kode Pos"
          className="border p-2 mb-4 w-full"
          onChange={handleChange}
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
