// Styling
import "../../styles/about/about.styles.css";

/**
 * Renders the biography section of the About page.
 * Displays personal background, career goals, and technical experience.
 *
 * @returns {JSX.Element} The AboutBio component.
 */

function AboutBio() {
    return (
        <div className="about_bio">
            <h1 className="about_bio_title">A little about me</h1>
            <h2 className="about_bio_desc">
                My name is Abraham Hernandez. I'm a Spanish-American with a
                Bachelor of Science degree in Computer Science from the
                Rochester Institute of Technology. Raised in San Rafael,
                California, I developed my passion for programming early on and
                am currently working as a full time software developer for More
                Vang.
            </h2>
            <h2 className="about_bio_desc">
                One of my biggest goals is to give back by helping students
                discover and pursue careers in tech. Growing up in San Rafael, I
                didn't have many resources or mentors to guide me into Computer
                Science—I had to figure out a lot on my own. That experience
                showed me how important it is to have support and guidance when
                you're just starting out. I want to make sure the next
                generation of students has access to the tools and knowledge
                they need to thrive as developers, especially those from
                underrepresented or underserved communities who might face
                similar barriers that I did.
            </h2>
            <h2 className="about_bio_desc">
                Aside from programming, I also like to garden, read sci-fi
                books, and listen to classical and 90's rock music!
            </h2>
        </div>
    );
}

export default AboutBio;
