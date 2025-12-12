import Header from "../components/header";
import Footer from "../components/footer";
import { cookies } from "next/headers";
import { AccountLogin } from "../types/account";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

async function getAccount(): Promise<AccountLogin | null> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
        .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${API_URL}/auth/whoami`, {
        headers: { Cookie: cookieHeader },
        credentials: "include",
        cache: "no-store",
    });

    if (res.ok) {
        const data = await res.json();
        return data.identity || data;
    }
    } catch (err) {
        console.error("Không thể lấy account:", err);
    }
    return null;
}

export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const account = await getAccount();

    return (
        <>
            <Header account={account} />
            <main className="pt-[90px] flex">{children}</main>
            <Footer />
        </>
  );
}