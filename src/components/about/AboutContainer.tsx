// Styling
import "../../styles/about/about.styles.css";

// Components
import AboutBio from "./AboutBio";
import AboutGallery from "./AboutGallery";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders the main container for the About page.
 * Combines the biography and image gallery, adjusting its width dynamically
 * based on the current window dimensions for responsive design.
 *
 * @returns {JSX.Element} The AboutContainer component.
 */

function AboutContainer() {
    const { width } = useWindowDimensions();

    return (
        <div style={{ width: `${width * 0.9}px` }} className="about_container">
            <AboutBio />
            <AboutGallery />
        </div>
    );
}

export default AboutContainer;
