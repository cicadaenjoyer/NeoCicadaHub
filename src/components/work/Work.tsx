// Styling
import "../../styles/work/work.styles.css";

// Components
import WorkItem from "./WorkItem";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

// Misc.
import { jobs } from "../../assets/constants";

/**
 * Renders the work experience section displaying professional job history.
 * Dynamically adjusts dimensions based on window size and maps through job data
 * to display individual work items with titles, descriptions, and company logos.
 *
 * @returns {JSX.Element} The work section component.
 */
function Work() {
    const { width, height } = useWindowDimensions();

    return (
        <div style={{ width: `${width}px` }} className="work">
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
