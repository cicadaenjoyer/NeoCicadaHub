import { useState, useEffect, useRef } from "react";

// Styling
import "../../styles/navigation/nagivation.styles.css";

// Constants
import equalizer_anim from "../../assets/images/home/audio-wave-50.gif";
import equalizer_static from "../../assets/images/home/audio-wave-50-static.gif";
import { tracks } from "../../assets/constants";

const musicModules = import.meta.glob("../../assets/audio/*.mp3", {
    eager: true,
});

/**
 * Renders an equalizer GIF icon that plays music across the site.
 * Randomly selects a song on mount and automatically plays the next song when one ends.
 *
 * @returns {JSX.Element} The MVPlayer button component.
 */
function MVPlayer() {
    const equalizer = {
        play: equalizer_anim,
        pause: equalizer_static,
    };

    const [icon, setIcon] = useState(equalizer.pause);
    const [isPlaying, setIsPlaying] = useState(false);
    const songRef = useRef<HTMLAudioElement | null>(null);
    const playlistRef = useRef([...tracks]); // Keep playlist in ref to avoid re-renders

    // Load and play a song by index
    const loadSong = (index: number) => {
        const audioPath = `../../assets/audio/${playlistRef.current[index].src}`;
        const audioModule = musicModules[audioPath];

        if (audioModule?.default) {
            // Clean up previous audio if exists
            if (songRef.current) {
                songRef.current.pause();
                songRef.current.removeEventListener("ended", handleSongEnd);
            }

            // Create new audio
            songRef.current = new Audio(audioModule.default);

            // Add event listener for when song ends
            songRef.current.addEventListener("ended", handleSongEnd);
        }
    };

    // Handle when a song ends
    const handleSongEnd = () => {
        // Get first song from playlist
        const nextSong = playlistRef.current.shift();

        if (nextSong) {
            // Add it to the back of the array
            playlistRef.current.push(nextSong);

            // Load and play the new first song
            loadSong(0);

            if (songRef.current) {
                songRef.current.play();
                songRef.current.volume = 0.3;
                setIsPlaying(true);
            }
        }
    };

    useEffect(() => {
        // Select random song on first load
        const randomIndex = Math.floor(
            Math.random() * playlistRef.current.length
        );

        // Reorder playlist so random song is first
        const selectedSong = playlistRef.current[randomIndex];
        playlistRef.current.splice(randomIndex, 1);
        playlistRef.current.unshift(selectedSong);

        // Load the song (but don't autoplay due to browser restrictions)
        loadSong(0);

        // Cleanup on unmount
        return () => {
            if (songRef.current) {
                songRef.current.pause();
                songRef.current.removeEventListener("ended", handleSongEnd);
                songRef.current.src = "";
            }
        };
    }, []);

    const playButton = () => {
        if (songRef.current) {
            if (isPlaying) {
                songRef.current.pause();
                setIcon(equalizer.pause);
                setIsPlaying(false);
            } else {
                songRef.current.play();
                songRef.current.volume = 0.3;
                setIcon(equalizer.play);
                setIsPlaying(true);
            }
        }
    };

    return (
        <img
            className="mv_player"
            src={icon}
            onClick={playButton}
            style={{ cursor: "pointer" }}
        />
    );
}

export default MVPlayer;
