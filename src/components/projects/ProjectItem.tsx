// Styling
import "../../styles/projects/projects.styles.css";

// Components
import ProjectInfo from "./ProjectInfo";
import ProjectView from "./ProjectView";

/**
 * Renders a single project item for the Projects page.
 * Combines the project visual representation and information,
 * displaying the project title, description, optional link, and associated media.
 *
 * @param {Object} props - The props for ProjectItem.
 * @param {string} props.title - The project title.
 * @param {string} props.desc - The project description.
 * @param {string} props.link - Optional URL for more information.
 * @param {string} props.view - The filename of the project media or visual.
 * @returns {JSX.Element} The ProjectItem component.
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
