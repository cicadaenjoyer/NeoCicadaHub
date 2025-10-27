// Styling
import "../../styles/navigation/nagivation.styles.css";

// Components
import TabButton from "./TabButton";
import MVPlayer from "./MVPlayer";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders the main navigation bar with tab buttons for different sections.
 * The navigation bar's width dynamically adjusts to the current window dimensions.
 *
 * @returns {JSX.Element} The navigation bar component.
 */
function NavigationBar() {
    const { width } = useWindowDimensions();

    return (
        <div style={{ width: `${width}px` }} className="bar" id="nav">
            <TabButton label="Home" location="/#nav" />
            <TabButton label="Work" location="/#work" />
            <TabButton label="Projects" location="/#projects" />
            <TabButton label="About" location="/#about" />
            <MVPlayer />
        </div>
    );
}

export default NavigationBar;
