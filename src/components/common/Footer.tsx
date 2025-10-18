import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulasi subscribe - dalam implementasi nyata, kirim ke API
      console.log("Subscribing email:", email);
      setSubscribed(true);
      setEmail("");

      // Reset notifikasi setelah beberapa detik
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Information */}
          <div>
            <div className="mb-4">
              <Logo className="text-white" showText={true} />
            </div>
            <p className="text-gray-300 mt-4">
              Toko sepatu Converse premium dengan berbagai pilihan model dan
              warna untuk gaya yang tak lekang waktu.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-gray-300 hover:text-white"
                >
                  Panduan Ukuran
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact Information - Spans 2 columns */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg mb-4">Kontak & Newsletter</h3>

            <div className="flex flex-col md:flex-row md:space-x-6">
              {/* Form Newsletter */}
              <div className="md:w-1/2 mb-4 md:mb-0">
                <form
                  onSubmit={handleSubscribe}
                  className="p-3 border border-gray-700 rounded-md bg-gray-900 h-full"
                >
                  <p className="text-sm text-white font-medium mb-3">
                    Dapatkan info produk & diskon terbaru:
                  </p>
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Anda"
                      className="px-3 py-2.5 text-black text-sm rounded-l-md w-full bg-white border-0 focus:ring-2 focus:ring-red-600"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gray-800 text-white px-4 py-2.5 text-sm font-semibold rounded-r-md hover:bg-gray-700 transition-colors"
                    >
                      Daftar
                    </button>
                  </div>
                  {subscribed && (
                    <p className="text-green-400 text-xs mt-2 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Terima kasih! Email Anda telah terdaftar.
                    </p>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="md:w-1/2">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" /> info@bakulconverse.com
                  </li>
                  <li>Telepon: (021) 1234-5678</li>
                  <li>
                    Alamat: Jl. Prof. H. Soedarto, SH, Kampus Tembalang, Kota
                    Semarang, Jawa Tengah
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Bakul Converse. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
