import { useEffect, useState } from "react";

// Styling
import "../../styles/home/home.styles.css";

// Components
import TypewriterComponent from "typewriter-effect";
import ProfileButton from "./ProfileButton";

// Constants
import { taglines } from "../../assets/constants";

/**
 * Renders the profile information section for the home page.
 * Displays the user's name, a randomly selected tagline with a typewriter effect, and profile action buttons.
 *
 * @returns {JSX.Element} The profile info component.
 */
function ProfileInfo() {
    const [tagline, setTagline] = useState("");

    useEffect(() => {
        const randIndex = Math.floor(Math.random() * taglines.length);

        setTagline(taglines.at(randIndex) ?? "");
    }, []);

    return (
        <div className="profile_info">
            <h1>Abraham Hernandez</h1>
            <TypewriterComponent
                options={{
                    strings: tagline,
                    autoStart: true,
                    loop: false,
                    deleteSpeed: 0,
                    cursor: "|",
                    wrapperClassName: "typewriter-text",
                }}
            />
            <div style={{ display: "flex", gap: "30px" }} className="buttons">
                <ProfileButton label="Work" />
                <ProfileButton label="Contact" />
            </div>
        </div>
    );
}

export default ProfileInfo;
