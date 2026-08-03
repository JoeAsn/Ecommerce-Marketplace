import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router";

interface MainLayoutProps {
  CartNo?: number;
}

export default function MainLayout(props: MainLayoutProps) {
  return (
    <>
      <Header cartNum={props.CartNo} />
      <Outlet />
      <Footer />
    </>
  );
}
