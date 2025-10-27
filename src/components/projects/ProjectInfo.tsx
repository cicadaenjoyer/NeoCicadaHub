// Styling
import "../../styles/projects/projects.styles.css";

/**
 * Renders a project information section.
 * Displays the project title, description, and an optional external link
 * in a styled layout.
 *
 * @param {Object} props - The props for ProjectInfo.
 * @param {string} props.title - The project title.
 * @param {string} props.desc - The project description.
 * @param {string} props.link - Optional URL for more information.
 * @returns {JSX.Element} The ProjectInfo component.
 */
interface ProjectInfoProps {
    title: string;
    desc: string;
    link: string;
}

function ProjectInfo({ title, desc, link }: ProjectInfoProps) {
    return (
        <div className="project_info">
            <h1 className="project_info_title">{title}</h1>
            <h2 className="project_info_desc">{desc}</h2>
            {link && (
                <a href={link} target="_blank" className="project_info_link">
                    Learn More
                </a>
            )}
        </div>
    );
}

export default ProjectInfo;
