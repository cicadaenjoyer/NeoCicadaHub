import "./App.css";
import NavigationBar from "./components/navigation/NavigationBar";
import Home from "./components/home/Home";
import Work from "./components/work/Work";

function App() {
    return (
        <div>
            <NavigationBar />
            <Home />
            <Work />
        </div>
    );
}

export default App;
