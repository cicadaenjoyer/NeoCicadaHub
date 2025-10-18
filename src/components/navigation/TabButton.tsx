// Styling
import "../../styles/navigation/nagivation.styles.css";

/**
 * Renders a styled tab button for navigation.
 * The button displays a label and logs a navigation message when clicked.
 *
 * @param {Object} props - The props for TabButton.
 * @param {string} props.label - The text displayed on the button.
 * @returns {JSX.Element} The tab button component.
 */

interface TabButtonProps {
    label: string;
}

function TabButton({ label }: TabButtonProps) {
    const handleClick = () => {
        console.log("NOTE: should navigate to the appropriate tab");
    };
    return (
        <button className="tab_button" onClick={handleClick}>
            {label}
        </button>
    );
}

export default TabButton;
