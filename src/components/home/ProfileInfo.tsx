import { useState, useEffect } from "react";

// Styling
import "../../styles/home/home.styles.css";

// Components
import ProfileButton from "./ProfileButton";
import ContactModal from "./ContactModal";
import TypewriterComponent from "typewriter-effect";

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
    const [isContactOpen, setIsContactOpen] = useState(false);

    useEffect(() => {
        const randIndex = Math.floor(Math.random() * taglines.length);
        setTagline(taglines.at(randIndex) ?? "");
    }, []);

    // onClick listeners for work and contact buttons
    const handleWorkClick = () => {
        window.location.replace("/#work");
    };
    const handleContactClick = () => {
        setIsContactOpen(true);
    };

    return (
        <>
            <div className="profile_info">
                <h1>Abraham Hernandez</h1>
                <TypewriterComponent
                    options={{
                        strings: tagline,
                        autoStart: true,
                        loop: false,
                        deleteSpeed: 0,
                        delay: 70,
                        cursor: "|",
                        wrapperClassName: "typewriter-text",
                    }}
                />
                <div
                    style={{ display: "flex", gap: "30px" }}
                    className="buttons"
                >
                    <ProfileButton label="Work" onClick={handleWorkClick} />
                    <ProfileButton
                        label="Contact"
                        onClick={handleContactClick}
                    />
                </div>
            </div>

            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </>
    );
}

export default ProfileInfo;
