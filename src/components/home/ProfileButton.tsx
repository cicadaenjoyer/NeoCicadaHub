// Styling
import "../../styles/home/home.styles.css";

/**
 * Renders a styled profile button for the home section.
 * Displays a label and handles click events based on the label value:
 * - "Work": Logs a message indicating navigation to the Work section.
 * - "Contact": Logs a message indicating a contact pop-up should appear.
 *
 * @param {Object} props - The props for ProfileButton.
 * @param {string} props.label - The text displayed on the button.
 * @returns {JSX.Element} The profile button component.
 */

interface ProfileButtonProps {
    label: string;
}

function ProfileButton({ label }: ProfileButtonProps) {
    const workClick = () => {
        console.log("NOTE: Should redirect user to 'Work' section");
    };
    const contactClick = () => {
        console.log(
            "NOTE: Should give a pop-up window with linkedin and email"
        );
    };
    const handleClick =
        label.toLocaleLowerCase().trim() === "work" ? workClick : contactClick;
    const buttonClass =
        label.toLocaleLowerCase().trim() === "work"
            ? "work_button"
            : "contact_button";

    return (
        <button className={buttonClass} onClick={handleClick}>
            {label}
        </button>
    );
}

export default ProfileButton;
