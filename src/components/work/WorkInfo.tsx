// Styling
import "../../styles/work/work.styles.css";

/**
 * Renders the information section for a work experience item.
 * Displays the job title and description in a formatted layout.
 *
 * @param {Object} props - The props for WorkInfo.
 * @param {string} props.title - The job title or position name.
 * @param {string} props.desc - The job description or responsibilities.
 * @returns {JSX.Element} The work info component.
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
