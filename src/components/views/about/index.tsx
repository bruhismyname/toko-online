import Head from "next/head";

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>Tentang Kami — ShoeStore</title>
        <meta name="description" content="Profil singkat brand & mitra ritel ShoeStore." />
      </Head>

      <main className="bg-white">

        <section className="mx-auto max-w-6xl px-6 pb-16 pt-4">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Tentang Kami</h1>

          <article className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Tentang Converse</h2>
            <p className="text-justify text-sm leading-7 text-gray-800">
              Converse Inc. berbasis di Boston, Massachusetts, merupakan anak perusahaan dari NIKE, Inc.
              Sejak awal abad ke-20, Converse dikenal lewat inovasi sepatu kanvas dan karet—ikon seperti
              <em> Chuck Taylor All Star</em>, <em>Chuck 70</em>, <em>Jack Purcell</em>, serta lini modern
              yang terinspirasi musik, subkultur, dan skateboard. Desainnya sederhana tapi universal:
              mudah dipadukan, kuat dipakai harian, dan terus berkembang melalui kolaborasi serta
              kustomisasi untuk mengekspresikan identitas pemakainya.
            </p>
            <p className="text-justify text-sm leading-7 text-gray-800">
              Selama lebih dari satu abad, Converse mendorong generasi muda bereksperimen lewat gerakan dan
              karya mereka. Mulai dari panggung musik hingga lapangan, sepatu Converse identik dengan warna,
              kenyamanan, dan cerita di balik pemakainya. Dengan jangkauan global dan komitmen pada
              keberlanjutan, Converse berupaya menginspirasi perubahan positif—mengajak komunitas untuk
              berkarya, bergerak, dan berani tampil apa adanya.
            </p>
          </article>

          <hr className="my-8 border-gray-200" />

          <article className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tentang Bakul Converse
            </h2>
            <p className="text-justify text-sm leading-7 text-gray-800">
              Bakul Converse adalah platform ritel daring yang menghadirkan koleksi sepatu Converse untuk pria dan wanita. Kami fokus pada gaya hidup aktif dan ekspresi personal melalui desain klasik hingga edisi terbaru dari Converse.
            </p>
            <p className="text-justify text-sm leading-7 text-gray-800">
              Lewat pengalaman belanja yang mudah dan modern, Bakul Converse memadukan pilihan produk terbaik, panduan ukuran interaktif, dan layanan pelanggan yang responsif. Kami percaya setiap langkah punya cerita — dan sepatu yang tepat bikin langkah itu lebih berarti. Temukan koleksi lengkap dan inspirasi gayamu di situs resmi Bakul Converse.
            </p>
          </article>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Kontak & Informasi</h3>
            <p className="text-sm text-gray-700">
              Pertanyaan kemitraan & media: <a href="mailto:info@shoestore.example" className="underline">info@bakulconverse.com</a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
