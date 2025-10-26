// Styling
import "../../styles/work/work.styles.css";

// Components
import WorkInfo from "./WorkInfo";
import WorkView from "./WorkView";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders a styled tab button for navigation.
 * The button displays a label and logs a navigation message when clicked.
 *
 * @param {Object} props - The props for TabButton.
 * @param {string} props.label - The text displayed on the button.
 * @returns {JSX.Element} The tab button component.
 */

interface WorkItemProps {
    title: string;
    desc: string;
    logo: string;
}

function WorkItem({ title, desc, logo }: WorkItemProps) {
    const { width } = useWindowDimensions();

    return (
        <div style={{ width: `${width * 0.9}px` }} className="work_item">
            <WorkInfo title={title} desc={desc} />
            <WorkView filename={logo} />
        </div>
    );
}

export default WorkItem;
