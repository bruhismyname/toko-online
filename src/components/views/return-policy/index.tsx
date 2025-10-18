import Head from "next/head";

const ReturnPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Kebijakan Pengembalian & Penukaran — ShoeStore</title>
        <meta
          name="description"
          content="Kebijakan pengembalian, penukaran, pengecualian, dan produk rusak."
        />
      </Head>

      <main className="bg-white">
        {/* Header */}
        <section className="mx-auto max-w-6xl px-6 pt-2 pb-12">
          {/* KEBIJAKAN PENGEMBALIAN */}
          <article className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Kebijakan Pengembalian</h1>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
              <p className="font-semibold uppercase tracking-wide">WAJIB VIDEO UNBOXING</p>
              <p className="mt-1">
                Untuk semua pengembalian, Anda wajib merekam dengan jelas proses pembukaan paket dari awal
                hingga selesai tanpa diedit. Kami tidak menerima keluhan kerusakan atau kekurangan produk
                tanpa video unboxing.
              </p>
            </div>

            <h3 className="pt-2 text-base font-semibold text-gray-900">Kriteria</h3>
            <ol className="ml-5 list-decimal space-y-3 text-justify text-sm leading-7 text-gray-800">
              <li>
                Produk dibeli dengan harga normal dan dengan diskon maksimal 30%. Kami tidak menerima
                pengembalian produk yang dibeli dengan diskon lebih dari 30% selama periode promosi.
              </li>
              <li>
                Produk belum pernah digunakan dan masih dalam kondisi seperti aslinya lengkap dengan label
                yang menempel pada produk dan tidak rusak.
              </li>
              <li>
                Tidak boleh ada noda, jahitan yang rusak, kancing yang hilang, benang yang mengendur, atau
                kondisi lain pada produk yang membuatnya dianggap produk cacat atau rusak.
              </li>
              <li>
                Produk harus memiliki kotak/bungkus dari merek produk dan kemasan dalam kondisi aslinya.
                Kotak dan kemasan tidak boleh rusak/penyok atau tertempel dengan bahan perekat apa pun dan
                lengkap dengan benda lain dari kemasan aslinya (karton, gantungan baju, stiker, pita, tali,
                polybag, plastik, dll).
              </li>
              <li>
                Pengajuan pengembalian produk harus dibuat dalam jangka waktu 14 (empat belas) hari setelah
                pesanan diterima. Produk yang dikembalikan harus diterima di lokasi yang telah ditentukan
                selambat-lambatnya 7 (tujuh) hari setelah tanggal pengembalian disetujui.
              </li>
              <li>
                Saat mengembalikan produk, mohon gunakan pembungkus/kotak luar seperti yang kami kirimkan
                dan lapisi kemasan produk dengan pembungkus yang kokoh serta menambahkan stiker
                “MUDAH PECAH” pada pengiriman untuk menghindari kerusakan kotak asli. Kami tidak menerima
                pengembalian dengan kerusakan pada produk atau pembungkus/kotak luar.
              </li>
              <li>
                Kami memerlukan waktu 7 (tujuh) hingga 14 (empat belas) hari kerja untuk memproses
                pengembalian dana Anda tergantung metode refund. Pengembalian dana dilakukan setelah kami
                menerima produk; ongkos kirim tidak diganti.
              </li>
              <li>
                Kontak Customer Service:{" "}
                <a
                  className="font-semibold underline"
                  href="mailto:info@bakulconverse.com"
                >
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
                </a>{" "}
                untuk pengajuan pengembalian.
              </li>
            </ol>
          </article>

          {/* Divider */}
          <hr className="my-10 border-gray-200" />

          {/* KEBIJAKAN PENUKARAN */}
          <article className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Kebijakan Penukaran</h2>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
              <p className="font-semibold uppercase tracking-wide">WAJIB VIDEO UNBOXING</p>
              <p className="mt-1">
                Untuk semua penukaran, Anda wajib merekam dengan jelas proses pembukaan paket dari awal
                hingga selesai tanpa diedit. Kami tidak menerima keluhan kerusakan atau kekurangan produk
                tanpa video unboxing.
              </p>
            </div>

            <h3 className="pt-2 text-base font-semibold text-gray-900">Kriteria</h3>
            <ol className="ml-5 list-decimal space-y-3 text-justify text-sm leading-7 text-gray-800">
              <li>
                Penukaran berlaku untuk produk dengan kriteria berikut:
                <ol className="ml-6 mt-2 list-decimal space-y-2">
                  <li>
                    <span className="font-semibold">Ukuran Salah</span>
                    <ul className="ml-5 mt-1 list-disc space-y-1">
                      <li>
                        Produk yang diterima tidak sesuai dengan yang dipesan (misal pesan no 30, diterima
                        ukuran 32).
                      </li>
                      <li>Ukuran pada fisik produk berbeda dengan kemasan/kotak.</li>
                      <li>Ukuran kiri dan kanan berbeda (sepatu).</li>
                      <li>Produk yang diterima kedua sisinya sama (dua kanan atau dua kiri).</li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-semibold">Warna Salah</span>
                    <ul className="ml-5 mt-1 list-disc space-y-1">
                      <li>
                        Warna produk tidak sama dengan deskripsi (misal pesan biru, datang merah).
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-semibold">Rusak</span>
                    <ul className="ml-5 mt-1 list-disc space-y-1">
                      <li>Warna memudar/berbeda.</li>
                      <li>
                        Bahan: kulit terkelupas, bahan tercabik/robek/tertusuk, jahitan/rajutan longgar.
                      </li>
                      <li>Komponen: lem lepas, tali rusak, bagian hilang, dll.</li>
                    </ul>
                  </li>
                </ol>
                {/* Per kategori detail */}
                <div className="mt-3 space-y-2">
                  <p className="font-semibold">Sepatu</p>
                  <ul className="ml-5 list-disc space-y-1">
                    <li>Minimal 1 ukuran berbeda antara kiri dan kanan.</li>
                    <li>Kulit terkelupas, jahitan longgar, bagian produk hilang.</li>
                    <li>Warna memudar/berbeda.</li>
                  </ul>
                </div>
              </li>

              <li>
                Penukaran ke tipe/model lain tidak diperbolehkan. Anda dapat melakukan pengembalian dana
                penuh (bila memenuhi kriteria) dan membuat pesanan baru. Penukaran hanya untuk produk yang
                sama (SKU, ukuran, warna yang sama).
              </li>
              <li>
                Pengajuan penukaran dibuat maksimal 14 (empat belas) hari setelah pesanan diterima dan
                produk harus diterima di lokasi penukaran paling lambat 7 (tujuh) hari setelah disetujui.
              </li>
              <li>
                Gunakan kemasan/kotak luar seperti saat kami kirim dan lapisi dengan pembungkus kokoh serta
                stiker “MUDAH PECAH”. Penukaran dengan kerusakan pada produk atau kemasan/box tidak
                diterima.
              </li>
              <li>
                Kontak Customer Service:{" "}
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
                </a>{" "}
                untuk pengajuan penukaran.
              </li>
            </ol>
          </article>

          {/* Divider */}
          <hr className="my-10 border-gray-200" />

          {/* Pengecualian */}
          <article className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Pengecualian</h2>
            <ul className="ml-5 list-disc space-y-3 text-justify text-sm leading-7 text-gray-800">
              <li>
                Perbedaan warna akibat efek lampu atau layar tidak dianggap cacat/keliru dan tidak dapat
                dijadikan dasar penukaran.
              </li>
              <li>
                Pembelian salah/perubahan pikiran setelah checkout tidak dapat diproses. Mohon tinjau ulang
                keranjang sebelum menyelesaikan pesanan.
              </li>
            </ul>
          </article>

          {/* Divider */}
          <hr className="my-10 border-gray-200" />

          {/* Produk Rusak */}
          <article className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Produk Rusak</h2>
            <p className="text-justify text-sm leading-7 text-gray-800">
              Semua deskripsi produk, informasi, dan materi yang ada di situs disediakan “apa adanya”
              tanpa jaminan langsung maupun tersirat.
            </p>
            <p className="text-justify text-sm leading-7 text-gray-800">
              Jika produk yang Anda terima rusak, hubungi Customer Service dan informasikan nomor pemesanan,
              nama, alamat, detail produk, alasan pengembalian, serta preferensi (refund/penukaran). Setelah
              produk diterima dan diperiksa, kami akan menginformasikan status refund atau penukaran (jika
              tersedia). Kami berhak menolak penukaran dan menawarkan pengembalian dana sebagai pengganti.
              Bila produk yang dikembalikan tidak rusak, kami berhak menolak penukaran atau pengembalian
              dana.
            </p>
          </article>
        </section>
      </main>
    </>
  );
};

export default ReturnPolicyPage;
