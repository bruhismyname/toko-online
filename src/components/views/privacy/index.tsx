import Head from "next/head";

const PrivacyPage = () => {
  return (
    <>
      <Head>
        <title>Kebijakan Privasi — Bakul Converse</title>
        <meta name="description" content="Kebijakan Privasi Bakul Converse." />
      </Head>

      <main className="bg-white">

        {/* Content */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-2">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">KEBIJAKAN PRIVASI</h1>

          <p className="mb-4 text-justify text-sm leading-7 text-gray-800">
            Kebijakan Privasi Bakul Converse menjelaskan bagaimana kami mengumpulkan, menggunakan, 
            dan melindungi informasi pribadi dari setiap pengguna situs (“Anda”). Data pribadi mencakup setiap 
            informasi yang dapat mengidentifikasi Anda secara langsung maupun tidak langsung, seperti nama, alamat email, 
            nomor telepon, alamat pengiriman, dan detail transaksi. Kami menghargai kepercayaan Anda dan berkomitmen 
            menjaga keamanan serta kerahasiaan data pribadi dengan menerapkan langkah perlindungan yang sesuai.
          </p>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Bakul Converse hanya mengumpulkan data yang dibutuhkan untuk memproses pesanan, memberikan layanan pelanggan, 
            serta meningkatkan pengalaman belanja Anda. Kami tidak akan membagikan atau menjual informasi pribadi kepada 
            pihak ketiga tanpa izin, kecuali jika diwajibkan oleh hukum atau diperlukan untuk penyelesaian transaksi seperti 
            pengiriman barang. Dengan menggunakan situs Bakul Converse, Anda menyetujui kebijakan ini dan memberikan izin bagi 
            kami untuk memproses data pribadi sesuai ketentuan yang berlaku.
          </p>

          {/* Informasi yang Dikumpulkan */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Informasi yang Kami Kumpulkan</h2>
          <p className="mb-3 text-justify text-sm leading-7 text-gray-800">
            Kami dapat memperoleh informasi pribadi tentang anda dari berbagai sumber, termasuk ketika anda
            menggunakan, mengakses dan/atau membuat akun di situs dan aplikasi seluler Bakul Converse, ketika
            anda mengunjungi atau melakukan pembelian di toko dan toko web kami, ketika anda berkomunikasi dan
            berinteraksi dengan kami melalui telepon, surat elektronik, atau media sosial, dari grup
            perusahaan kami (yaitu, induk, afiliasi, atau anak perusahaan), mitra bisnis, dan pihak ketiga
            lainnya yang memiliki izin untuk membagikan data pribadi anda kepada kami.
          </p>
          <p className="text-sm text-gray-800">Jenis informasi dan data pribadi yang kami kumpulkan termasuk, namun tidak terbatas pada:</p>
          <ul className="ml-5 mb-8 list-disc space-y-2 text-justify text-sm leading-7 text-gray-800">
            <li>Informasi terkait kontak (misalnya, nama, alamat, alamat surat elektronik, dan nomor telepon).</li>
            <li>Informasi untuk mengidentifikasi individu (misalnya, tanggal lahir, usia, jenis kelamin, berat badan, tinggi badan, ukuran fisik).</li>
            <li>Foto (misalnya saat anda mendaftar untuk mengikuti kontes atau bergabung dalam acara kami).</li>
            <li>Informasi perbankan (misalnya, kartu debit, kartu kredit, detail rekening bank).</li>
            <li>Catatan komunikasi anda dengan kami (misalnya, catatan panggilan telepon, fitur live chat, surat elektronik/surat, atau catatan kontak lainnya).</li>
            <li>Informasi kredensial (misalnya, informasi keamanan untuk otentikasi dan akses ke akun/layanan).</li>
            <li>Jenis/versi OS, perangkat keras, pengaturan perangkat, identitas perangkat, produsen dan model, bahasa, serta jenis/versi peramban.</li>
            <li>Informasi yang dikumpulkan otomatis (cookie &amp; web beacon).</li>
            <li>Informasi lokasi geografis (mis. lokasi dari alamat IP).</li>
            <li>Informasi analitik pihak ketiga tentang lalu lintas pengunjung situs/aplikasi kami.</li>
          </ul>

          {/* Penggunaan */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Bagaimana Kami Menggunakan Informasi anda</h2>
          <p className="mb-3 text-justify text-sm leading-7 text-gray-800">Kami dapat menggunakan informasi yang kami peroleh dari anda untuk:</p>
          <ul className="ml-5 mb-8 list-disc space-y-2 text-justify text-sm leading-7 text-gray-800">
            <li>Mendaftarkan akun dan mengelolanya.</li>
            <li>Menyediakan produk/layanan kepada anda.</li>
            <li>Memproses &amp; melacak pesanan (pembayaran, pengiriman, retur/refund, komunikasi pesanan).</li>
            <li>Menyimpan catatan pembelian.</li>
            <li>Menanggapi pertanyaan, memberi dukungan, dan menyelesaikan isu layanan.</li>
            <li>Berkomunikasi soal produk/layanan/penawaran/acara/promosi yang relevan.</li>
            <li>Memfasilitasi interaksi via blog/jejaring sosial/media interaktif.</li>
            <li>Mempublikasikan testimoni (nama depan/inisial, kota, wilayah).</li>
            <li>Mengelola partisipasi di acara, undian, dan promosi.</li>
            <li>Personalisasi konten, optimasi situs, dan penargetan penawaran/iklan.</li>
            <li>Mengoperasikan, mengevaluasi, dan meningkatkan bisnis/produk/layanan.</li>
            <li>Menganalisis efektivitas komunikasi &amp; pemasaran.</li>
            <li>Menganalisis penggunaan situs/aplikasi/medsos serta pembelian.</li>
            <li>Keamanan, anti-penipuan, dan manajemen risiko.</li>
            <li>Menegakkan Syarat Penggunaan &amp; S&amp;K Situs.</li>
            <li>Memenuhi persyaratan hukum/standar industri/kebijakan internal.</li>
            <li>Tujuan lain yang dijelaskan saat pengumpulan dan diizinkan hukum.</li>
          </ul>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Selain hal di atas, kami dan mitra penyedia layanan kami dapat menggunakan informasi yang
            dikumpulkan melalui cookie, beacon, tag piksel, dan cara otomatis lainnya untuk mengumpulkan
            informasi tertentu secara otomatis saat anda menggunakan situs/aplikasi kami. Kami juga dapat
            menggabungkan informasi yang kami kumpulkan dengan informasi yang tersedia untuk umum dan informasi
            dari induk/afiliasi/anak perusahaan, mitra bisnis, dan pihak ketiga lainnya untuk peningkatan
            pengalaman, komunikasi, promosi, dan tujuan lain sebagaimana dijelaskan di atas.
          </p>

          {/* Dasar hukum */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Dasar Hukum Penggunaan Informasi Anda</h2>
          <p className="mb-4 text-justify text-sm leading-7 text-gray-800">
            Dasar hukum kami dalam mengumpulkan dan menggunakan informasi pribadi bergantung pada konteksnya.
            Kami memerlukan informasi untuk memenuhi perjanjian dengan anda, kewajiban hukum, atau kepentingan
            sah (administratif, pemasaran langsung, peningkatan layanan, pencegahan penipuan &amp; keamanan
            informasi). Jika diwajibkan hukum atau perjanjian, kami akan menjelaskan sifat kewajiban dan
            konsekuensi jika tidak diberikan. Jika menggunakan dasar kepentingan sah, kami akan memberi
            pemberitahuan yang jelas dan langkah-langkah yang wajar.
          </p>

          {/* Iklan online */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Iklan Online</h2>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Kami dapat mengumpulkan informasi aktivitas online untuk menampilkan iklan yang disesuaikan. Kami
            berpartisipasi dalam jejaring iklan yang melacak aktivitas dari waktu ke waktu (cookie, log server,
            web beacon, dll.) untuk menayangkan iklan Bakul Converse dan mitra yang relevan serta mengukur
            efektivitas pemasaran.
          </p>

          {/* Pembagian informasi */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Informasi yang Kami Bagikan</h2>
          <p className="mb-3 text-justify text-sm leading-7 text-gray-800">
            Kami tidak menjual informasi pribadi anda. Kami dapat membagikannya sesuai Kebijakan ini, termasuk:
          </p>
          <ul className="ml-5 mb-4 list-disc space-y-2 text-justify text-sm leading-7 text-gray-800">
            <li>Dengan induk, afiliasi, anak perusahaan (tujuan manajemen/analisis/operasional).</li>
            <li>Dengan mitra bisnis/prinsipal/pihak ketiga &amp; penyedia layanan operasional/jaringan.</li>
            <li>Dengan penyedia pembayaran/bank/lembaga keuangan (otorisasi, anti-fraud, dukungan).</li>
            <li>Dengan mitra pihak ketiga untuk penawaran/promosi.</li>
            <li>Dengan jaringan iklan, jejaring sosial, penyedia analitik.</li>
            <li>Untuk promosi bersama—mereka tunduk pada peraturan privasi masing-masing.</li>
            <li>Dengan penyedia layanan situs/aplikasi &amp; optimasi layanan.</li>
            <li>Dengan otoritas/penegak hukum untuk patuh hukum, penegakan kebijakan, dan perlindungan hak.</li>
            <li>Dengan persetujuan anda atau dasar sah lain.</li>
          </ul>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Transfer lintas batas dapat terjadi. Kami memastikan perlindungan memadai (setara/lebih tinggi dari
            Indonesia, atau standar memadai yang mengikat). Jika tidak terpenuhi, kami menambah perlindungan
            atau meminta persetujuan eksplisit anda.
          </p>

          {/* Penyimpanan & Retensi */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Penyimpanan dan Retensi</h2>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Data disimpan selama diperlukan/diizinkan untuk tujuan perolehan. Disimpan secara elektronik di
            pusat data kami/penyedia layanan dengan kontrol keamanan yang diperlukan. Retensi mempertimbangkan
            hukum, investigasi, kontrak, kebutuhan operasional, dan pengarsipan. Setelah berakhir, data akan
            dihapus dengan protokol yang sesuai.
          </p>

          {/* Hak-hak */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Hak-hak anda</h2>
          <p className="mb-3 text-justify text-sm leading-7 text-gray-800">
            Hak dapat ditolak dalam kondisi tertentu (keselamatan/kesehatan, data orang lain, keamanan negara,
            atau tidak relevan). Biaya administrasi dapat dikenakan sesuai peraturan.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak untuk mendapatkan informasi</h3>
          <p className="mb-3 text-sm text-gray-800">Anda dapat meminta informasi berikut:</p>
          <ul className="ml-5 mb-5 list-disc space-y-2 text-sm leading-7 text-gray-800">
            <li>Kategori data pribadi yang dikumpulkan.</li>
            <li>Tujuan pengumpulan dan penggunaan.</li>
            <li>Kategori pihak ketiga penerima.</li>
            <li>Pernah/tidaknya diungkap untuk tujuan bisnis beserta kategorinya.</li>
          </ul>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak Akses</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda dapat meminta salinan data pribadi yang kami kumpulkan tentang anda.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak untuk Memperbaiki Data Pribadi</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda berhak meminta koreksi atas data pribadi yang tidak akurat atau tidak lengkap.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak untuk Meminta Penghapusan Data Pribadi</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda dapat meminta penghapusan data pribadi sesuai batasan/ketentuan hukum.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak untuk Meminta Pembatasan Pemrosesan</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda dapat meminta pembatasan pemrosesan (misal saat menyanggah keakuratan data).
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak untuk Menarik Persetujuan</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda dapat menarik persetujuan kapan saja. Kami akan berhenti memproses dalam 3×24 jam kecuali
            diwajibkan hukum. Penarikan mungkin membatasi akses terhadap fitur/penawaran tertentu.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak atas Portabilitas Data</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda berhak memperoleh data dalam format yang dapat dibaca dan mengirimkannya ke pengendali lain.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak untuk Menolak Pengambilan Keputusan Secara Otomatis</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda dapat menolak keputusan otomatis termasuk pemrofilan yang berdampak hukum atau signifikan.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Hak untuk Mendapatkan Ganti Rugi</h3>
          <p className="mb-5 text-sm leading-7 text-gray-800">
            Anda berhak meminta ganti rugi atas pelanggaran hak perlindungan data.
          </p>

          <h3 className="mb-2 text-base font-semibold text-gray-900">Non-Diskriminasi</h3>
          <p className="mb-8 text-sm leading-7 text-gray-800">
            Anda dapat menggunakan hak-hak di atas tanpa diskriminasi.
          </p>

          {/* Tautan */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Tautan ke Situs Web Lain</h2>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Situs kami mungkin berisi tautan ke situs lain yang dioperasikan pihak yang tidak terafiliasi.
            Mereka memiliki Kebijakan Privasi sendiri. Kami tidak bertanggung jawab atas konten, penggunaan, dan
            praktik privasi situs-situs tersebut.
          </p>

          {/* Keamanan */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Cara Kami Melindungi Informasi Pribadi</h2>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Kami menerapkan pengamanan administratif, teknis, dan fisik (mis. SSL). Tidak ada transmisi
            elektronik yang sepenuhnya aman; kami akan memberi tahu anda jika terjadi kegagalan perlindungan
            data. Lindungi akun anda (jangan bagikan kredensial, selalu keluar setelah selesai). Kami tidak
            pernah meminta username/password melalui email.
          </p>

          {/* Anak */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Informasi tentang anak</h2>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Jika di bawah 17 tahun, mintalah persetujuan orang tua/wali sebelum mendaftar, menggunakan jasa,
            atau berbelanja. Tanpa persetujuan, hentikan penggunaan situs.
          </p>

          {/* Pembaruan */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Pembaruan terhadap Kebijakan Privasi ini</h2>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Kebijakan ini dapat diperbarui berkala tanpa pemberitahuan. Silakan cek halaman ini secara rutin.
            Perubahan signifikan akan diberi pemberitahuan jelas di situs beserta tanggal pembaruan.
          </p>

          {/* Unsubscribe */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Pilihan untuk Berhenti Berlangganan Buletin Pemasaran Kami</h2>
          <p className="mb-3 text-justify text-sm leading-7 text-gray-800">
            Saat mendaftar buletin, anda bisa memilih untuk tidak berlangganan email/surat pemasaran. Semua
            email kami menyertakan tautan berhenti berlangganan. Anda juga bisa mengatur preferensi lewat
            halaman “Akun Saya”.
          </p>

          {/* Hukum */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Hukum yang berlaku</h2>
          <p className="mb-8 text-justify text-sm leading-7 text-gray-800">
            Kebijakan ini tunduk pada hukum Republik Indonesia. Dibuat dalam Bahasa Indonesia dan Inggris.
            Jika terjadi perbedaan, versi Bahasa Indonesia yang berlaku.
          </p>

          {/* Contact */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Hubungi Kami</h2>
          <p className="mb-6 text-justify text-sm leading-7 text-gray-800">
            Untuk pertanyaan atau penggunaan hak-hak anda, hubungi kami via email{" "}
            <a className="font-semibold underline" href="mailto:info@bakulconverse.com">
              info@bakulconverse.com
            </a>{" "}
            atau WhatsApp{" "}
            <a
              className="font-semibold underline"
              href="https://wa.me/6281575111117"
              target="_blank"
              rel="noreferrer"
            >
              081575111117
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
};

export default PrivacyPage;
