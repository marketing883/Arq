import SectionTabs from "@/components/admin/SectionTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionTabs section="content" />
      {children}
    </>
  );
}
