import { useMemo, useState, useEffect } from "react";

/** ---------- Types & helpers ---------- */
type Gender = "women" | "men";
type Row = { us: number; chuck: number; probb: number; others: number; footIn: number };

const US_SIZES_WOMEN = [3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12];
const US_SIZES_MEN   = [3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14];

// approx foot length curve; cukup halus & realistis
function footLengthInches(us: number, gender: Gender) {
  const base = gender === "women" ? 8.4 : 8.5; // titik awal kira2
  const slope = 0.333;                          // ~1/3 inch per 1 US
  return base + slope * (us - (gender === "women" ? 4 : 3.5));
}

// tampilkan inch pecahan 1/8 biar rapi (8 1/2", 8 5/8", dst)
function toInchFraction(x: number) {
  const inches = Math.floor(x);
  const eighths = Math.round((x - inches) * 8);
  const map: Record<number, string> = {
    0: "", 1: "1/8", 2: "1/4", 3: "3/8", 4: "1/2", 5: "5/8", 6: "3/4", 7: "7/8", 8: ""
  };
  const frac = map[eighths > 8 ? 8 : eighths];
  const val = inches + (eighths === 8 ? 1 : 0);
  return frac ? `${val} ${frac}″` : `${val}″`;
}
const toCM = (x: number) => `${(x * 2.54).toFixed(1)} cm`;
const showHalf = (n: number) => (Number.isInteger(n) ? `${n}` : `${n}`);

function buildRows(gender: Gender): Row[] {
  const base = gender === "women" ? US_SIZES_WOMEN : US_SIZES_MEN;
  return base.map((us) => ({
    us,
    chuck: us - 0.5,   // runs half size large
    probb: us + 0.5,   // runs half size small
    others: us,        // true to size
    footIn: footLengthInches(us, gender),
  }));
}

/** ---------- External icons (from your URLs) ---------- */
const ICONS = {
  foot: "https://www.converse.id/media/wysiwyg/D-CONVERSE-H020-SIZE-GUIDE-FOOT.png",
  chuck: "https://www.converse.id/media/wysiwyg/D-CONVERSE-H020-SIZE-GUIDE-CHUCK-TAYLOR-ALL-STAR.png",
  probb: "https://www.converse.id/media/wysiwyg/D-CONVERSE-H020-SIZE-GUIDE-PRO-BB.png",
  other: "https://www.converse.id/media/wysiwyg/D-CONVERSE-H020-SIZE-GUIDE-JACK-PURCELL.png",
  ruler: "https://www.converse.id/media/wysiwyg/D-CONVERSE-H020-SIZE-GUIDE-RULER.png",
};

/** ---------- Page (content only; no navbar/footer) ---------- */
const SizeGuidePage = () => {
  const [tab, setTab] = useState<Gender>("men");
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const rows = useMemo(() => buildRows(tab), [tab]);
  
  // Add this useEffect hook to scroll to top on component mount
  useEffect(() => {
    // Scroll to top of page
    window.scrollTo(0, 0);
    
    // Clear any hash fragments in the URL to prevent automatic scrolling
    if (window.location.hash) {
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }, []);
  
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb/heading space ditangani layout global kamu; di sini langsung konten */}
      <section className="mx-auto max-w-6xl px-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-900">Panduan Ukuran Bakul Converse</h1>
        <p className="mt-1 text-sm text-gray-600">
          Untuk Pria &amp; Wanita — hanya sepatu. Ikuti panduan di bawah biar ukuranmu pas sempurna.
        </p>

        {/* Tabs */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setTab("women")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "women" ? "bg-black text-white" : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            Wanita
          </button>
          <button
            onClick={() => setTab("men")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "men" ? "bg-black text-white" : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            Pria
          </button>
        </div>

        {/* Jump To */}
        <div className="mt-3 flex flex-wrap gap-6 text-sm">
          <a href="#chart" className="text-gray-700 hover:text-black">Panduan Ukuran</a>
          <a href="#how" className="text-gray-700 hover:text-black">Panduan Menemukan Ukuran</a>
          <a href="#details" className="text-gray-700 hover:text-black">Selengkapnya</a>
        </div>
      </section>

      {/* Chart title + steps */}
      <section id="chart" className="mx-auto max-w-6xl px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {tab === "men" ? "Tabel Ukuran Sepatu Pria" : "Tabel Ukuran Sepatu Wanita"}
        </h2>
        <div className="mt-6 space-y-1 text-sm text-gray-700">
          <p>Langkah 1. Temukan ukuran US yang biasa kamu pakai.</p>
          <p>Langkah 2. Bandingkan ukuran US kamu dengan model sepatu Converse yang kamu inginkan.</p>
        </div>

        {/* Icon row like the reference */}
        <div className="mt-6 grid grid-cols-12 items-end gap-4">
          {/* 1: Find Your Shoe Size */}
          <div className="col-span-2">
            <div className="flex h-24 items-end justify-center">
              <img src={ICONS.foot} alt="Find your shoe size" className="h-20 object-contain" />
            </div>
            <p className="mt-2 text-center text-xs text-gray-700">Temukan Ukuran Sepatumu</p>
          </div>
          {/* 2: Chuck 70 */}
          <div className="col-span-3">
            <div className="flex h-24 items-end justify-center">
              <img src={ICONS.chuck} alt="Chuck Taylor / Chuck 70" className="h-20 object-contain" />
            </div>
            <p className="mt-2 text-center text-xs text-gray-700">Chuck Taylor All Star / Chuck 70</p>
          </div>
          {/* 3: All Star Pro BB */}
          <div className="col-span-3">
            <div className="flex h-24 items-end justify-center">
              <img src={ICONS.probb} alt="All Star Pro BB / BB Evo" className="h-20 object-contain" />
            </div>
            <p className="mt-2 text-center text-xs text-gray-700">All Star Pro BB / BB Evo</p>
          </div>
          {/* 4: All Other Styles */}
          <div className="col-span-2">
            <div className="flex h-24 items-end justify-center">
              <img src={ICONS.other} alt="All Other Styles" className="h-20 object-contain" />
            </div>
            <p className="mt-2 text-center text-xs text-gray-700">Gaya Lainnya*</p>
          </div>
          {/* 5: Ruler + unit toggle */}
          <div className="col-span-2">
            <div className="flex h-24 items-end justify-center">
              <img src={ICONS.ruler} alt="Ruler" className="h-16 object-contain" />
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs">
              <button
                onClick={() => setUnit("in")}
                className={`rounded px-2 py-1 font-semibold ${
                  unit === "in" ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                inches
              </button>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => setUnit("cm")}
                className={`rounded px-2 py-1 font-semibold ${
                  unit === "cm" ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                cm
              </button>
            </div>
          </div>
        </div>

        {/* Header labels row */}
        <div className="mt-6 grid grid-cols-12 border-y border-gray-200 text-xs font-medium text-gray-600">
          {/* US Size */}
          <div className="col-span-2 flex items-center justify-center py-4 text-center">
            <span className="tracking-wide">Ukuran US</span>
          </div>

          {/* Chuck Taylor / Chuck 70 */}
          <div className="col-span-3 flex flex-col items-center justify-center py-4 px-2 text-center leading-tight">
            <span className="font-normal text-gray-700">Lebih Besar (½ Ukuran)</span>
          </div>

          {/* All Star Pro BB / BB Evo */}
          <div className="col-span-3 flex flex-col items-center justify-center py-4 px-2 text-center leading-tight">
            <span className="font-normal text-gray-700">Lebih Kecil (½ Ukuran)</span>
          </div>

          {/* All Other Styles */}
          <div className="col-span-2 flex flex-col items-center justify-center py-4 px-2 text-center leading-tight">
            <span className="font-normal text-gray-700">
              Ukuran bisa berbeda per model.
            </span>
          </div>

          {/* Foot Length */}
          <div className="col-span-2 flex flex-col items-center justify-center bg-[#00BCD4] py-4 text-center leading-tight text-white">
            <span className="font-medium tracking-wide">
              Panjang Kaki ({unit === "in" ? "in" : "cm"})
            </span>
          </div>
        </div>

        {/* Rows with zebra stripe + blue hover like reference */}
        <div className="overflow-hidden rounded-b-2xl border border-gray-200">
          {rows.map((r, i) => (
            <div
              key={`${tab}-${r.us}`}
              className={`group grid grid-cols-12 text-sm transition ${
                i % 2 === 1 ? "bg-gray-50" : "bg-white"
              } hover:bg-cyan-50`}
            >
              <div className="col-span-2 py-3 text-center font-medium text-gray-900">{showHalf(r.us)}</div>
              <div className="col-span-3 py-3 text-center text-gray-800">{showHalf(r.chuck)}</div>
              <div className="col-span-3 py-3 text-center text-gray-800">{showHalf(r.probb)}</div>
              <div className="col-span-2 py-3 text-center text-gray-800">{showHalf(r.others)}</div>
              <div className="col-span-2 py-3 text-center font-semibold text-gray-900 group-hover:bg-cyan-200">
                {unit === "in" ? toInchFraction(r.footIn) : toCM(r.footIn)}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <p className="mt-2 text-xs text-gray-500">
          "Gaya Lainnya" mencakup seri seperti Jack Purcell, One Star, Pro Leather, G4, dan lini Converse lainnya.
          Lihat halaman detail produk untuk rekomendasi ukuran yang disarankan.
        </p>
      </section>

      {/* Wide Width Sizes (seperti contoh) */}
<section id="wide" className="mx-auto max-w-6xl px-6 pt-8">
  <h3 className="text-2xl font-bold text-gray-900">Untuk Kaki yang Lebih Lebar.</h3>
  <p className="mt-2 text-sm text-gray-700">
    Ukuran lebar ekstra mencakup lebih banyak volume dan platform yang lebih lebar sekitar 15mm di bagian bola dan punggung kaki
    dan 6mm di lebar bagian bawah.
  </p>
</section>

    {/* How To Find Your Size (pakai gambar dari URL yang kamu kasih) */}
    <section id="how" className="mx-auto max-w-6xl px-6 pt-8">
      <h3 className="text-2xl font-bold text-gray-900">Panduan Menemukan Ukuran</h3>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Step 1 */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative">
            <img
              src="https://www.converse.com/on/demandware.static/-/Library-Sites-SharedLibrary/default/dwe3bfcbf8/size_guide/D-CONVERSE-SIZE-GUIDE-MENS-SHOES-STEP-1.jpg"
              alt="Step 1"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <p className="text-base font-semibold text-gray-900">Langkah 1</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Temukan permukaan datar dan keras, lalu tempelkan selembar kertas kosong menempel pada dinding.
              Letakkan kakimu di atas kertas dengan tumit menempel pada dinding, dan berdirilah tegak.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative">
            <img
              src="https://www.converse.com/on/demandware.static/-/Library-Sites-SharedLibrary/default/dw460d4e84/size_guide/D-CONVERSE-SIZE-GUIDE-MENS-SHOES-STEP-2.jpg"
              alt="Step 2"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <p className="text-base font-semibold text-gray-900">Langkah 2</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Minta temanmu menandai bagian paling panjang dari kakimu (dari tumit sampai ujung jari) di kertas menggunakan pulpen atau pensil. 
              Kalau perlu, kamu juga bisa melakukannya sendiri. Ulangi langkah ini untuk kaki satunya, karena ukuran kanan dan kiri bisa berbeda.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative">
            <img
              src="https://www.converse.com/on/demandware.static/-/Library-Sites-SharedLibrary/default/dwa9847411/size_guide/D-CONVERSE-SIZE-GUIDE-MENS-SHOES-STEP-3.jpg"
              alt="Step 3"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <p className="text-base font-semibold text-gray-900">Langkah 3</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Gunakan penggaris untuk mengukur panjang dari tumit ke ujung jari yang sudah kamu tandai tadi.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Free Returns (tetap sama, biar nyambung dengan screenshot) */}
    <section id="returns" className="mx-auto max-w-6xl px-6 pt-8 pb-12">
      <h3 className="text-2xl font-bold text-gray-900">Pengembalian Gratis</h3>
      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700 shadow-sm">
        <p className="mb-3">
          Belum yakin sama ukuranmu? Coba aja pesan dua ukuran — setengah lebih kecil dan setengah lebih besar — terus balikin yang nggak pas. Gampang banget, gratis pula!
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Proses pengembalian tanpa biaya</li>
          <li>Gratis ongkir untuk pesanan dan pengembalian buat member BakulConverse.com</li>
          <li>Bisa dikembalikan karena alasan apa pun dalam waktu 30 hari setelah barang diterima</li>
        </ul>
      </div>
    </section>

    </main>
  );
};

export default SizeGuidePage;
