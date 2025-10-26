// Styling
import "../../styles/projects/projects.styles.css";

// Components
import ProjectInfo from "./ProjectInfo";
import ProjectView from "./ProjectView";

/**
 * Renders a single project experience item with job information and company logo.
 * Dynamically adjusts width based on window dimensions and displays job details
 * alongside the company's visual branding.
 *
 * @param {Object} props - The props for projectItem.
 * @param {string} props.title - The job title or position name.
 * @param {string} props.desc - The job description or responsibilities.
 * @param {string} props.logo - The filename of the company logo image.
 * @returns {JSX.Element} The project item component.
 */
interface ProjectItemProps {
    title: string;
    desc: string;
    link: string;
    view: string;
}

function ProjectItem({ title, desc, link, view }: ProjectItemProps) {
    return (
        <div className="project_item">
            <ProjectView filename={view} />
            <ProjectInfo title={title} desc={desc} link={link} />
        </div>
    );
}

export default ProjectItem;
