// Styling
import "../../styles/work/work.styles.css";

/**
 * Renders a styled tab button for navigation.
 * The button displays a label and logs a navigation message when clicked.
 *
 * @param {Object} props - The props for TabButton.
 * @param {string} props.label - The text displayed on the button.
 * @returns {JSX.Element} The tab button component.
 */

interface WorkInfoProps {
    title: string;
    desc: string;
}

function WorkInfo({ title, desc }: WorkInfoProps) {
    return (
        <div className="work_info">
            <h1 className="work_info_title">{title}</h1>
            <h2 className="work_info_desc">{desc}</h2>
        </div>
    );
}

export default WorkInfo;
