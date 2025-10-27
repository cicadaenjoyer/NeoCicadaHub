// Styling
import "../../styles/work/work.styles.css";

// Misc.
const logoModules = import.meta.glob<{ default: string }>(
    "../../assets/images/projects/*",
    {
        eager: true,
    }
);

/**
 * Renders the visual/logo section for a work experience item.
 * Dynamically imports and displays company logos from the work images directory.
 *
 * @param {Object} props - The props for ProjectView.
 * @param {string} props.filename - The filename of the company logo (e.g., "rit.png").
 * @returns {JSX.Element} The work view component.
 */
interface ProjectViewProps {
    filename: string;
}

function ProjectView({ filename }: ProjectViewProps) {
    const fullPath = `../../assets/images/projects/${filename}`;
    const logo = logoModules[fullPath]?.default;

    return (
        <div className="project_view">
            <img className="project_view_img" src={logo} />
        </div>
    );
}

export default ProjectView;
