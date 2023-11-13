const api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const searchbarForm = document.getElementById('header__searchbar__form');
const headerSpan = document.getElementById('header__span');
const word = document.getElementById('main__header');
const phoneticsSpan = document.getElementById('main__span');
const mainNounListContainer = document.getElementById('main__noun__list__container');
const mainVerbListContainer = document.getElementById('main__verb__list__container');
const synonymsSpan = document.getElementById('main__synonyms__span');
const playIcon = document.getElementById('main__play__icon');
const srcUrl = document.getElementById('src-url');

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

        const phonetics = data[0].phonetics;
        // Using find method to find the first instance of phonetic.text
        const firstPhoneticText = phonetics.find((phonetic) => phonetic.text);

        if (firstPhoneticText) {
          phoneticsSpan.innerHTML = firstPhoneticText.text;
        } else {
          phoneticsSpan.innerHTML = 'Phonetics not listed';
        }

        // Using find method to find the first instance of phonetic sound

        const firstPhoneticSound = phonetics.find((phoneticSound) => {
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
            meaning.definitions.forEach((definitionObject) => {
              const definition = definitionObject.definition;
              const nounListItem = document.createElement('li');
              nounListItem.innerHTML += definition;

              // Attaching the listitem to the UL
              nounList.appendChild(nounListItem);
            });
          });

        // Append the UL list to the container
        mainNounListContainer.appendChild(nounList);

        // Span meanings[0] = partofSpeech noun
        const synonymsArr = data[0].meanings[0].synonyms.join(', ');
        synonymsSpan.innerHTML = synonymsArr;

        // Verb meaning
        const verbList = document.getElementById('main__verb__list');
        const mainVerbSpan = document.getElementById('main__verb__span');

        meanings
          .filter((meaning) => meaning.partOfSpeech === 'verb')
          .forEach((meaning) => {
            // Clear the existing content of verbList
            verbList.innerHTML = '';
            mainVerbSpan.innerHTML = '';

            meaning.definitions.forEach((definition) => {
              const verbDefinition = definition.definition;
              const verbExample = definition.example;

              // Create List item
              const verbListItem = document.createElement('li');
              verbListItem.innerHTML = verbDefinition;

              // Attaching the list item to the UL
              verbList.className = 'main__verb__list';
              verbList.appendChild(verbListItem);

              // // Verb Example
              mainVerbSpan.innerHTML = `"${verbExample}"`;
            });
          });

        // Append the UL list to the container
        mainVerbListContainer.appendChild(verbList);

        const verbSrcUrl = data[0].sourceUrls;
        console.log('srcURL', data[0].sourceUrls);
        srcUrl.innerHTML = verbSrcUrl;
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
});
