// Styling
import "../../styles/navigation/nagivation.styles.css";

/**
 * Renders a styled tab button for navigation.
 * The button displays a label and logs a navigation message when clicked.
 *
 * @param {Object} props - The props for TabButton.
 * @param {string} props.label - The text displayed on the button.
 * @param {string} props.location - The section to jump to onClick.
 * @returns {JSX.Element} The tab button component.
 */

interface TabButtonProps {
    label: string;
    location: string;
}

function TabButton({ label, location }: TabButtonProps) {
    const handleClick = () => {
        window.location.replace(location);
    };
    return (
        <button className="tab_button" onClick={handleClick}>
            {label}
        </button>
    );
}

export default TabButton;
