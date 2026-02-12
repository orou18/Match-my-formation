import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <DashboardNavbar />

      <main className="flex-grow pt-24"> 
        {children}
      </main>

      <DashboardFooter />
    </div>
  );
}