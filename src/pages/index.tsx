import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Bakul Converse | Sepatu Converse Premium</title>
      </Head>
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="font-bold text-4xl">Hello Tailwind + Next.js 🚀</h1>
      </div>
    </>
  );
}
