import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }
  return (
    <div className="flex bg-background min-h-svh">
      <div>Sidbar</div>

      <div className="flex-1 flex flex-col">
        <div>Navbar</div>
        <main className="flex-1 overflow-y-auto md:ml-64 pt-16 p-4 md:px-6 transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
