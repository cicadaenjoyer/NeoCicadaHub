// Styling
import "../../styles/about/about.styles.css";

// Components
import AboutBio from "./AboutBio";
import AboutGallery from "./AboutGallery";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders a single work experience item with job information and company logo.
 * Dynamically adjusts width based on window dimensions and displays job details
 * alongside the company's visual branding.
 *
 * @returns {JSX.Element} The work item component.
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
