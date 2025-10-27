import { useCallback } from "react";

// Styling
import "../../styles/work/work.styles.css";

// Components
import useEmblaCarousel from "embla-carousel-react";

// Misc.
const picModules = import.meta.glob("../../assets/images/about/*", {
    eager: true,
});

/**
 * Renders the gallery section of the About page.
 * Displays a carousel of images dynamically imported from the About images directory,
 * with navigation controls to scroll through the gallery.
 *
 * @returns {JSX.Element} The AboutGallery component.
 */

function AboutGallery() {
    const [emblaRef, emblaApi] = useEmblaCarousel();

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const gallery = Object.values(picModules).map((module) => module.default);

    return (
        <div className="about_embla">
            <div className="about_embla_viewport" ref={emblaRef}>
                <div className="about_embla_container">
                    {gallery.map((image, index) => (
                        <div className="project_embla_slide" key={index}>
                            <img className="about_gallery_img" src={image} />
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ flexDirection: "row" }}>
                <button className="about__prev" onClick={scrollPrev}>
                    Prev
                </button>
                <button className="about__next" onClick={scrollNext}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default AboutGallery;
