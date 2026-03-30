// Styling
import "../../styles/home/home.styles.css";

// Components
import ProfileInfo from "./ProfileInfo";
import ProfileHeadshot from "./ProfileHeadshot";

/**
 * Renders the Home page section of the website.
 * Combines the profile information and headshot components,
 * adjusting its size dynamically based on the current window dimensions.
 *
 * @returns {JSX.Element} The Home page component.
 */
function Home() {
    return (
        <div className="home" id="home">
            <ProfileInfo />
            <ProfileHeadshot />
        </div>
    );
}

export default Home;
