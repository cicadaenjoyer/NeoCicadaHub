// Styling
import "../../styles/projects/projects.styles.css";

// Misc.
const logoModules = import.meta.glob<{ default: string }>(
    "../../assets/images/projects/*",
    {
        eager: true,
    }
);

/**
 * Renders the visual/media section of a project item.
 * Dynamically imports and displays a project image based on the provided filename.
 *
 * @param {Object} props - The props for ProjectView.
 * @param {string} props.filename - The filename of the project image (e.g., "project.png").
 * @returns {JSX.Element} The ProjectView component.
 */
interface ProjectViewProps {
    filename: string;
}

function ProjectView({ filename }: Readonly<ProjectViewProps>) {
    const fullPath = `../../assets/images/projects/${filename}`;
    const logo = logoModules[fullPath]?.default;

    return (
        <div className="project_view">
            <img className="project_view_img" src={logo} alt={filename} />
        </div>
    );
}

export default ProjectView;
