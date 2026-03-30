// Styling
import "../../styles/about/about.styles.css";

// Components
import AboutBio from "./AboutBio";
import AboutGallery from "./AboutGallery";

/**
 * Renders the main container for the About page.
 * Combines the biography and image gallery, adjusting its width dynamically
 * based on the current window dimensions for responsive design.
 *
 * @returns {JSX.Element} The AboutContainer component.
 */

function AboutContainer() {
    return (
        <div className="about_container">
            <AboutBio />
            <AboutGallery />
        </div>
    );
}

export default AboutContainer;
