document.addEventListener("DOMContentLoaded", function () {
    // Read song info from the text file (assuming it's named "songs.txt")
    fetch("songs.txt")
        .then(response => response.text())
        .then(text => {
            const songs = text.split("\n").filter(line => line.trim() !== ""); // Remove empty lines
            // Initialize slideshow
            let currentIndex = 0;
            const albumCover = document.getElementById("albumCover");
            const songName = document.getElementById("songName");

            function displaySong(index) {
                const [song, cover, jsCode] = songs[index].split("|");

                albumCover.src = cover;
                songName.textContent = song;

                // Define the click event listener
                function handleClick() {
                    try {
                        eval(jsCode); // Execute the JavaScript code associated with the song
                        // Remove the click event listener after it's triggered once
                        albumCover.removeEventListener("click", handleClick);
                    } catch (error) {
                        console.error("Error executing JavaScript code:", error);
                    }
                }

                // Attach click event listener to the album cover
                albumCover.addEventListener("click", handleClick);

                // Advance to the next song
                currentIndex = (currentIndex + 1) % songs.length;
                setTimeout(() => displaySong(currentIndex), 3000); // Change slide every 3 seconds
            }

            // Start the slideshow
            displaySong(currentIndex);
        })
        .catch(error => console.error("Error reading songs.txt:", error));
});
