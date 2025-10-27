// Styling
import "../../styles/about/about.styles.css";

// Components
import AboutContainer from "./AboutContainer";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders the About page section of the website.
 * The component dynamically adjusts its size based on the current window dimensions
 * and contains the main content managed by the AboutContainer component.
 *
 * @returns {JSX.Element} The About page component.
 */
function About() {
    const { width, height } = useWindowDimensions();

    return (
        <div
            style={{ width: `${width}px`, height: `${height}px` }}
            className="about"
            id="about"
        >
            <AboutContainer />
        </div>
    );
}

export default About;
