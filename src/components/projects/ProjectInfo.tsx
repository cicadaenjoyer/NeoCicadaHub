// Styling
import "../../styles/projects/projects.styles.css";

/**
 * Renders the information section for a work experience item.
 * Displays the job title and description in a formatted layout.
 *
 * @param {Object} props - The props for ProjectInfo.
 * @param {string} props.title - The job title or position name.
 * @param {string} props.desc - The job description or responsibilities.
 * @returns {JSX.Element} The work info component.
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
