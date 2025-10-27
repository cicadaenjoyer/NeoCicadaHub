import "./App.css";
import NavigationBar from "./components/navigation/NavigationBar";
import Home from "./components/home/Home";
import Work from "./components/work/Work";
import Projects from "./components/projects/Projects";
import About from "./components/about/About";

function App() {
    return (
        <div>
            <NavigationBar />
            <Home />
            <Work />
            <Projects />
            <About />
        </div>
    );
}

export default App;
