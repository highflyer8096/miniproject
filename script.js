document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const track = document.getElementById('track').files[0];
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;

    if (track && title && artist) {
        const formData = new FormData();
        formData.append('track', track);
        formData.append('title', title);
        formData.append('artist', artist);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message);
    } else {
        alert('Please fill out all fields.');
    }
});

document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const query = document.getElementById('query').value;
    const resultsContainer = document.getElementById('search-results');

    if (query) {
        const response = await fetch(`/search?query=${query}`);
        const results = await response.json();

        resultsContainer.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        } else {
            const list = document.createElement('ul');
            results.forEach(track => {
                const item = document.createElement('li');
                item.innerHTML = `${track.title} by ${track.artist} <button class="play-button" data-filename="${track.filename}">Play</button>`;
                list.appendChild(item);
            });
            resultsContainer.appendChild(list);

            // Add event listeners to play buttons
            const playButtons = document.querySelectorAll('.play-button');
            playButtons.forEach(button => {
                button.addEventListener('click', async () => {
                    const filename = button.getAttribute('data-filename');
                    const audioPlayer = document.getElementById('audioPlayer');
                    const audioSource = document.getElementById('audioSource');

                    // Set the audio source to the selected track
                    audioSource.src = `/play?filename=${filename}`;
                    audioPlayer.load(); // Reload the audio element to update source
                    audioPlayer.play(); // Start playing the audio

                    // Optionally, you can provide user feedback
                    alert(`Playing ${filename}`);
                });
            });
        }
    } else {
        alert('Please enter a search query.');
    }
});
