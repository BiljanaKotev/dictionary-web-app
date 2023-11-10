let api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en';

let searchbarForm = document.getElementById('header__searchbar__form');
let headerSpan = document.getElementById('header__span');
let word = document.getElementById('main__header');
let phoneticsSpan = document.getElementById('main__span');
let mainNounListContainer = document.getElementById('main__noun__list__container');
let synonymsSpan = document.getElementById('main__synonyms__span');
let playIcon = document.getElementById('main__play__icon');

searchbarForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let searchbarInput = document.getElementById('header__searchbar__input').value;

  if (searchbarInput === '') {
    headerSpan.innerHTML = 'Please enter a word';
  } else {
    // FETCH API CALL
    fetch(`${api_url}/${searchbarInput}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        // Handle the data from the API here
        word.innerHTML = data[0].word;
        // phonetics.innerHTML = data[0].phonetics[0].text;

        let phonetics = data[0].phonetics;
        // Using find method to find the first instance of phonetic.text
        let firstPhoneticText = phonetics.find((phonetic) => phonetic.text);

        if (firstPhoneticText) {
          phoneticsSpan.innerHTML = firstPhoneticText.text;
        } else {
          phoneticsSpan.innerHTML = 'Phonetics not listed';
        }

        // Using find method to find the first instance of phonetic sound

        let firstPhoneticSound = phonetics.find((phoneticSound) => {
          return phoneticSound.audio;
        });

        let firstPhoneticSoundAudio = firstPhoneticSound.audio;

        // Create an HTML Audio element
        const audioElement = new Audio(firstPhoneticSoundAudio);

        // when i click the play button i want the audio to play

        function playAudio() {
          audioElement.play();
        }

        playIcon.addEventListener('click', playAudio);

        mainNounListContainer.innerHTML = '';

        // Create UL List
        const nounList = document.createElement('ul');
        nounList.className = 'main__noun__list';

        const meanings = data[0].meanings;
        meanings
          .filter((meaning) => {
            console.log('noun', meaning.partOfSpeech === 'noun');
            return meaning.partOfSpeech === 'noun';
          })
          .forEach((meaning) => {
            // we are looping over the data (meanings array within the data array)
            // Create List Item inside the forEach
            const nounListItem = document.createElement('li');

            // Loop over the defintiions array
            meaning.definitions.forEach((definitionObject) => {
              const definition = definitionObject.definition;
              nounListItem.innerHTML += `<li>${definition}</li>`;
            });

            // Attaching the listitem to the UL
            nounList.appendChild(nounListItem);
          });

        // Append the UL list to the container
        mainNounListContainer.appendChild(nounList);

        // Span meanings[0] = partofSpeech noun
        let synonymsArr = data[0].meanings[0].synonyms.join(', ');
        synonymsSpan.innerHTML = synonymsArr;

        // Verb meaning

        meanings
          .filter((meaning) => {
            console.log('verb', meaning.partOfSpeech === 'verb');
            return meaning.partOfSpeech === 'verb';
          })
          .forEach((meaning) => {
            console.log(meaning.definitions);

            const verbListItem = document.createElement('li');
            meaning.definitions.forEach(() => {});
          });
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
});
