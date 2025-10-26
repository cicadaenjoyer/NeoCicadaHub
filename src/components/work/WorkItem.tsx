// Styling
import "../../styles/work/work.styles.css";

// Components
import WorkInfo from "./WorkInfo";
import WorkView from "./WorkView";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

/**
 * Renders a single work experience item with job information and company logo.
 * Dynamically adjusts width based on window dimensions and displays job details
 * alongside the company's visual branding.
 *
 * @param {Object} props - The props for WorkItem.
 * @param {string} props.title - The job title or position name.
 * @param {string} props.desc - The job description or responsibilities.
 * @param {string} props.logo - The filename of the company logo image.
 * @returns {JSX.Element} The work item component.
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
