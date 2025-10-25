// Styling
import "../../styles/home/home.styles.css";

interface ProfileButtonProps {
    label: string;
    onClick?: () => void;
}

/**
 * Renders a styled profile button for the home section.
 * Displays a label and handles click events based on the label value:
 * - "Work": Logs a message indicating navigation to the Work section.
 * - "Contact": Logs a message indicating a contact pop-up should appear.
 *
 * @param {Object} props - The props for ProfileButton.
 * @param {string} props.label - The text displayed on the button.
 * @param {() => void} [props.onClick] - Optional callback function to execute when the button is clicked
 * @returns {JSX.Element} The profile button component.
 */
function ProfileButton({ label, onClick }: ProfileButtonProps) {
    return (
        <button className={label.toLocaleLowerCase().trim()} onClick={onClick}>
            {label}
        </button>
    );
}

export default ProfileButton;
