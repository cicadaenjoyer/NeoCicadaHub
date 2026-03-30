// Styling
import "../../styles/work/work.styles.css";

// Components
import WorkItem from "./WorkItem";

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
    return (
        <div className="work" id="work">
            <h1 className="banner">My Professional Experience</h1>
            {jobs.map((job) => (
                <WorkItem
                    key={job.title}
                    title={job.title}
                    desc={job.desc}
                    logo={job.logo}
                />
            ))}
        </div>
    );
}

export default Work;
