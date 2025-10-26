// Styling
import "../../styles/projects/projects.styles.css";

// Components
import ProjectItem from "./ProjectItem";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

// Misc.
import { projects } from "../../assets/constants";

/**
 * Renders the work experience section displaying professional job history.
 * Dynamically adjusts dimensions based on window size and maps through job data
 * to display individual work items with titles, descriptions, and company logos.
 *
 * @returns {JSX.Element} The work section component.
 */
function Projects() {
    const { width, height } = useWindowDimensions();

    return (
        <div
            style={{ width: `${width}px`, height: `${height}px` }}
            className="projects"
        >
            <h1 className="banner">My Recent Work</h1>
            {projects.map((project) => (
                <>
                    <ProjectItem
                        title={project.title}
                        desc={project.desc}
                        link={project.link}
                        view={project.view}
                    />
                </>
            ))}
        </div>
    );
}

export default Projects;
