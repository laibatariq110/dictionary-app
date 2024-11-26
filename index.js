
document.getElementById("search-bar").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        myIcon.click();
    }
});

let data;

const myIcon = document.getElementById("myIcon");
const firstLine = document.getElementById("firstLine");
const wordHeading = document.getElementById("wordHeading");
const favicon = document.getElementById("favicon");
const originalFavicon = "favicon.jpg";
const spinnerFavicon = "spinner.jpg.gif";
const divider1 = document.getElementById("divider1");
const divider2 = document.getElementById("divider2");

const getData = async (word) => {
    const URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    let response = await fetch(URL);
    data = await response.json();
    return data;
}
getData();

myIcon.onclick = async () => {
    const searched = document.getElementById("search-bar").value.toLowerCase().trim();
    divider1.style.display = "block";
    divider2.style.display = "block";

    if (searched) {
        favicon.href = spinnerFavicon;
        firstLine.innerHTML = `Meaning of <strong>${searched}</strong> in English`;

        let data = await getData(searched);
        let meanings = data[0].meanings;
        let phonetics = data[0].phonetics;

        let usAudio = phonetics.find(p => p.audio.includes('-us.mp3'))?.audio || '';
        let ukAudio = phonetics.find(p => p.audio.includes('-uk.mp3'))?.audio || '';

        let audioHtml = '';
        if (usAudio) {
            audioHtml += '<i class="fa-solid fa-volume-high" id="usAudio" style="margin-right: 10px; font-size: 0.5em; cursor: pointer;"></i><span style="font-size: 0.3em;">US&nbsp;&nbsp;</span>';
        }
        if (ukAudio) {
            audioHtml += '<i class="fa-solid fa-volume-high" id="ukAudio" style="margin-right: 10px; font-size: 0.5em; cursor: pointer;"></i><span style="font-size: 0.3em;">UK</span>';
        }

        wordHeading.innerHTML = `${searched} ${audioHtml}`;

        // Adding event listeners to play audio 
        if (usAudio) {
            const usAudioElement = document.getElementById("usAudio");
            if (usAudioElement) {
                usAudioElement.addEventListener('click', () => {
                    new Audio(usAudio).play();
                });
            }
        }
        if (ukAudio) {
            const ukAudioElement = document.getElementById("ukAudio");
            if (ukAudioElement) {
                ukAudioElement.addEventListener('click', () => {
                    new Audio(ukAudio).play();
                });
            }
        }

        let meaningsHtml = "";

        meanings.forEach((meaning) => {
            meaningsHtml += `<h3 style="margin: 10px 0 10px 0;">${meaning.partOfSpeech}</h3>`;
            meaning.definitions.forEach((definition, index) => {
                meaningsHtml += `<p style="padding: 10px 0 15px 0;">${index + 1}. ${definition.definition}</p>`;
            });
        });

        document.getElementById("description").innerHTML = meaningsHtml;
        favicon.href = originalFavicon;
    }
}