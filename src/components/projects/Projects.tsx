import { useCallback } from "react";

// Styling
import "../../styles/projects/projects.styles.css";

// Components
import useEmblaCarousel from "embla-carousel-react";
import ProjectItem from "./ProjectItem";

// Hooks
import useWindowDimensions from "../../hooks/WindowDimensions";

// Misc.
import { projects } from "../../assets/constants";

/**
 * Renders the projects section displaying a carousel of recent work.
 * Dynamically adjusts dimensions based on window size and uses Embla Carousel
 * to display project items in a swipeable carousel.
 *
 * @returns {JSX.Element} The projects section component.
 */
function Projects() {
    const [emblaRef, emblaApi] = useEmblaCarousel();

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const { width, height } = useWindowDimensions();

    return (
        <div
            style={{ width: `${width}px`, height: `${height}px` }}
            className="projects"
            id="projects"
        >
            <h1 className="banner">My Recent Work</h1>

            <div className="project_embla">
                <div className="project_embla_viewport" ref={emblaRef}>
                    <div className="project_embla_container">
                        {projects.map((project, index) => (
                            <div className="project_embla_slide" key={index}>
                                <ProjectItem
                                    title={project.title}
                                    desc={project.desc}
                                    link={project.link}
                                    view={project.view}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ flexDirection: "row" }}>
                <button className="project__prev" onClick={scrollPrev}>
                    Prev
                </button>
                <button className="project__next" onClick={scrollNext}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Projects;
