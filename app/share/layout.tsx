import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";

// Deliberately its own layout, not the (protected) one: that layout
// redirects straight to /login with no way back to the link the visitor
// actually clicked. The share page itself checks auth and, if needed,
// redirects to /login?callbackUrl=/share/<token> so a brand new visitor
// lands back here right after logging in or registering.
export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <NavBar />
      <main className="page">{children}</main>
    </Providers>
  );
}
