import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo className="text-white" showText={true} />
            </div>
            <p className="text-gray-300 mt-4">
              Toko sepatu Converse premium dengan berbagai pilihan model dan
              warna untuk gaya yang tak lekang waktu.
            </p>

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

          <div>
            <h3 className="font-bold text-lg mb-4">Kategori Sepatu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white"
                >
                  Classic Chuck
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white"
                >
                  Double Stack
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white"
                >
                  Run Star Trainer
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Tautan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
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
              <li>
                <Link
                  href="/return-policy"
                  className="text-gray-300 hover:text-white"
                >
                  Kebijakan Pengembalian
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> info@bakulconverse.com
              </li>
              <li>Telepon: (021) 1234-5678</li>
              <li>Alamat: Jl. Sepatu No.123, Jakarta</li>
            </ul>
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