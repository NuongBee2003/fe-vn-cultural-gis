import "./index.css";
import Menu from "./components/user/menu/Menu";
import HomePage from "./feature/map/pages/HomePage";

function App() {

// test commit
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Menu />
      <HomePage/>
    </div>
  );
}

export default App;
