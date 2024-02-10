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
function getRedirectedUrl(runnerId) {
    return new Promise((resolve, reject) => {
        // Create iframe element
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none'; // Hide the iframe

        // Get the URL from the cookie
        const url = getCookie('server');
        if (!url) {
            reject('Redirect URL not found in cookie');
            return;
        }

        // Set iframe attributes
        iframe.src = url;
        iframe.id = runnerId;

        // Append iframe to the document body
        document.body.appendChild(iframe);

        // Check for redirect
        iframe.onload = () => {
            // Check if the URL has been redirected
            if (iframe.contentWindow.location.href !== url) {
                resolve(iframe.contentWindow.location.href); // Return the redirected URL
            } else {
                reject('No redirect detected');
            }
            // Remove the iframe from the document
            document.body.removeChild(iframe);
        };
    });
}
// Function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function createVideoPlayer(redirectedUrl) {
    // Create video element
    const video = document.createElement('video');
    video.style.height = '0px'; // Set height to 0px to hide the player
    video.controls = true; // Show controls

    // Set video source
    const source = document.createElement('source');
    source.src = redirectedUrl;
    video.appendChild(source);

    // Append video to the document body
    document.body.appendChild(video);
}
function createVideoPlayer(redirectedUrl, videoId) {
    // Create video element
    const video = document.createElement('video');
    video.style.height = '0px'; // Set height to 0px to hide the player
    video.controls = true; // Show controls

    // Set video source
    const source = document.createElement('source');
    source.src = redirectedUrl;
    video.appendChild(source);

    // Append video to the document body
    document.body.appendChild(video);

    // Create image element for loading
    const loadingImg = document.createElement('img');
    loadingImg.classList.add('art');
    loadingImg.src = 'img/load.jpg'; // Path to loading image
    document.body.appendChild(loadingImg);

    // Fetch thumbnail from YouTube
    fetch(`https://img.youtube.com/vi/${videoId}/sddefault.jpg`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch thumbnail');
            }
            return response.blob();
        })
        .then(blob => {
            const thumbnailUrl = URL.createObjectURL(blob);
            // Replace loading image with thumbnail
            loadingImg.src = thumbnailUrl;
        })
        .catch(error => {
            console.error('Error fetching thumbnail:', error);
        });
}
