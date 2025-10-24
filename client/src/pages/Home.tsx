import Carousel from "../components/Carousel";
import Menu from "../components/Menu";

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      <Carousel />
      <Menu />
    </div>
  );
}
