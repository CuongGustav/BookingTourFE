import NavbarAccount from "../../components/navbarAccount";

export default function AccountLayout ({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavbarAccount/>
            <main>{children}</main>
        </>
    )
}