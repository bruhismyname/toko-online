import ProfileView from "@/components/views/account/profile";
import Head from "next/head";

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Profil Saya | Bakul Converse</title>
        <meta
          name="description"
          content="Kelola profil dan alamat Anda di Bakul Converse"
        />
      </Head>
      <ProfileView />
    </>
  );
}
