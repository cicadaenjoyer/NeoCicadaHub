// Styling
import "../../styles/work/work.styles.css";

// Misc.
const logoModules = import.meta.glob<{ default: string }>(
    "../../assets/images/work/*",
    {
        eager: true,
    }
);

/**
 * Renders a styled tab button for navigation.
 * The button displays a label and logs a navigation message when clicked.
 *
 * @param {Object} props - The props for TabButton.
 * @param {string} props.label - The text displayed on the button.
 * @returns {JSX.Element} The tab button component.
 */

interface WorkViewProps {
    filename: string;
}

function WorkView({ filename }: WorkViewProps) {
    const fullPath = `../../assets/images/work/${filename}`;
    const logo = logoModules[fullPath]?.default;

    console.log(filename);

    console.log(logo);

    return (
        <div className="work_view">
            <img className="work_view_img" src={logo} />
        </div>
    );
}

export default WorkView;
