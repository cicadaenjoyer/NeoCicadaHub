import "./App.css";
import NavigationBar from "./components/navigation/NavigationBar";
import Home from "./components/home/Home";
import Work from "./components/work/Work";
import Projects from "./components/projects/Projects";

function App() {
    return (
        <div>
            <NavigationBar />
            <Home />
            <Work />
            <Projects />
        </div>
    );
}

export default App;
