// Styling
import "../../styles/home/home.styles.css";
import headshot from "../../assets/images/home/headshot.gif";

/**
 * Renders the profile information section for the home page.
 * Displays the user's name, a randomly selected tagline with a typewriter effect, and profile action buttons.
 *
 * @returns {JSX.Element} The profile info component.
 */
function ProfileHeadshot() {
    return (
        <div className="profile_headshot">
            <img src={headshot}></img>
        </div>
    );
}

export default ProfileHeadshot;
