// Styling
import "../../styles/home/home.styles.css";

// Components
import ProfileInfo from "./ProfileInfo";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders the main navigation bar with tab buttons for different sections.
 * The navigation bar's width dynamically adjusts to the current window dimensions.
 *
 * @returns {JSX.Element} The navigation bar component.
 */
function Home() {
    const { width, height } = useWindowDimensions();

    return (
        <div
            style={{ width: `${width}px`, height: `${height * 0.9}px` }}
            className="home"
        >
            <ProfileInfo />
        </div>
    );
}

export default Home;
