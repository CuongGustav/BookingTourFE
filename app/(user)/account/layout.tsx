import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import NavbarAccount from "../../components/navbarAccount";
import { AccountLogin } from "../../types/account";

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

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const account = await getAccount();
    // If not login, redirect login page
    if (!account) {
        redirect("/auth");
    }

    return (
        <>
            <NavbarAccount account={account} />
            <main>{children}</main>
        </>
    );
}