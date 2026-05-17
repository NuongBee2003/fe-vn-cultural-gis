import Menu from "@/components/user/menu/Menu";
import HomePage from "@/pages/home/HomePage";

export default function MapLayout({ children }) {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Menu />
      {children || <HomePage />}
    </div>
  );
}
