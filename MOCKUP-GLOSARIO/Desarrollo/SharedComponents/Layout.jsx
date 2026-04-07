import Navbar from './Navbar.jsx';
import SideMenu from './SideMenu.jsx';
import Footer from './Footer.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <SideMenu />
      <main>
        <div className="container-allComponents">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
