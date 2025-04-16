import Header from '../components/Header';
import MainBanner from '../components/MainBanner';
import PopularCategories from '../components/PopularCategories';
import MoneyBackBanner from '../components/MoneyBackBanner';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <MainBanner />
      <PopularCategories />
      <MoneyBackBanner />
      <Footer />
    </>
  );
}
