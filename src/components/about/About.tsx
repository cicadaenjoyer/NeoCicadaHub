// Styling
import "../../styles/about/about.styles.css";

// Components
import AboutContainer from "./AboutContainer";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders the main navigation bar with tab buttons for different sections.
 * The navigation bar's width dynamically adjusts to the current window dimensions.
 *
 * @returns {JSX.Element} The navigation bar component.
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
