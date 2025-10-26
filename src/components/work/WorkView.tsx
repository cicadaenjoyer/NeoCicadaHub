// Styling
import "../../styles/work/work.styles.css";

// Misc.
const logoModules = import.meta.glob<{ default: string }>(
    "../../assets/images/work/*",
    {
        eager: true,
    }
);

/**
 * Renders the visual/logo section for a work experience item.
 * Dynamically imports and displays company logos from the work images directory.
 *
 * @param {Object} props - The props for WorkView.
 * @param {string} props.filename - The filename of the company logo (e.g., "rit.png").
 * @returns {JSX.Element} The work view component.
 */
interface WorkViewProps {
    filename: string;
}

function WorkView({ filename }: WorkViewProps) {
    const fullPath = `../../assets/images/work/${filename}`;
    const logo = logoModules[fullPath]?.default;

    return (
        <div className="work_view">
            <img className="work_view_img" src={logo} />
        </div>
    );
}

export default WorkView;
