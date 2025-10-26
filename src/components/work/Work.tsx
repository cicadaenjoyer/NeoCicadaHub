// Styling
import "../../styles/work/work.styles.css";

// Components
import WorkItem from "./WorkItem";
import WorkView from "./WorkView";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

// Misc.
import { jobs } from "../../assets/constants";

/**
 * Renders the main navigation bar with tab buttons for different sections.
 * The navigation bar's width dynamically adjusts to the current window dimensions.
 *
 * @returns {JSX.Element} The navigation bar component.
 */
function Work() {
    const { width, height } = useWindowDimensions();

    return (
        <div
            style={{ width: `${width}px`, height: `${height * 0.9}px` }}
            className="work"
        >
            <h1 className="banner">My Professional Experience</h1>
            {jobs.map((job) => (
                <>
                    <WorkItem
                        title={job.title}
                        desc={job.desc}
                        logo={job.logo}
                    />
                </>
            ))}
        </div>
    );
}

export default Work;
