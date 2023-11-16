const api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const body = document.getElementById('body');
const main = document.getElementById('main');
const headerFontSelection = document.getElementById('header__font__selection');
const headerFontSelectionContainer = document.getElementById('header__font__selection__container');
const selectBtn = document.getElementById('header__selection__submit__btn');
const fontSansSerif = document.getElementById('header__font__sans__serif');
const fontSerif = document.getElementById('header__font__serif');
const fontMono = document.getElementById('header__font__mono');
const headerFontUl = document.getElementById('header__font__ul');
const headerNavImg = document.getElementById('header__nav__img');
const searchbarForm = document.getElementById('header__searchbar__form');
const headerInput = document.getElementById('header__searchbar__input');
const headerSpan = document.getElementById('header__span');
const headerErrorContainer = document.getElementById('header__error__container');
const word = document.getElementById('main__header');
const phoneticsSpan = document.getElementById('main__span');
const mainNounListContainer = document.getElementById('main__noun__list__container');
const mainVerbListContainer = document.getElementById('main__verb__list__container');
const synonymsSpan = document.getElementById('main__synonyms__span');
const playIcon = document.getElementById('main__play__icon');
const srcUrl = document.getElementById('src-url');
const srcLink = document.querySelector('.main__src__link');
const footer = document.getElementById('footer');

headerErrorContainer.style.display = 'none';

// UL display on click
headerFontUl.style.display = 'none';
const displayFontOptions = () => {
  headerFontUl.style.display = headerFontUl.style.display === 'none' ? 'block' : 'none';
};

const changeFontToSansSerif = () => {
  document.body.style.fontFamily = 'InterVariable';
};

const changeFontToSerif = () => {
  document.body.style.fontFamily = 'LoraVariable';
};

const changeFontToMono = () => {
  document.body.style.fontFamily = 'InconsolataVariable';
};

const changeToDarkMode = () => {
  body.classList.toggle('dark__body');
  headerInput.classList.toggle('header__searchbar__input__dark');
  fontSansSerif.classList.toggle('dark');
  fontSerif.classList.toggle('header__font__serif__dark');
  fontMono.classList.toggle('header__font__mono__dark');
  headerFontSelectionContainer.classList.toggle('header__font__selection__container__dark');
};

headerNavImg.addEventListener('click', changeToDarkMode);

selectBtn.addEventListener('click', displayFontOptions);
fontSansSerif.addEventListener('click', changeFontToSansSerif);
fontSerif.addEventListener('click', changeFontToSerif);
fontMono.addEventListener('click', changeFontToMono);

searchbarForm.addEventListener('submit', (e) => {
  e.preventDefault();

  headerErrorContainer.style.display = 'none';

  let searchbarInput = document.getElementById('header__searchbar__input').value;

  if (searchbarInput === '') {
    headerSpan.innerHTML = 'Please enter a word';
  } else {
    // FETCH API CALL
    fetch(`${api_url}/${searchbarInput}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          headerSpan.innerHTML = '';
          main.classList.toggle('display__none');
          footer.classList.toggle('display__none');
          headerErrorContainer.style.display = 'block';
          return;
        }

        headerSpan.innerHTML = '';
        console.log('received data', data);
        // Handle the data from the API here
        word.innerHTML = data[0].word;

        // Display the main and footer elements
        main.style.display = 'block';
        footer.style.display = 'block';

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
            return meaning.partOfSpeech === 'noun';
          })
          .forEach((meaning) => {
            meaning.definitions.forEach((definitionObject) => {
              const definition = definitionObject.definition;

              const nounListItem = document.createElement('li');
              nounListItem.classList.add('pb-2');
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
              console.log('definition', definition);
              console.log('verb-definition', verbDefinition);
              console.log('verb-example', verbExample);

              // Create List item
              const verbListItem = document.createElement('li');
              // Add bootsrap classname to list item
              verbListItem.classList.add('pb-2');

              verbListItem.innerHTML = verbDefinition;

              verbList.className = 'main__verb__listing';

              // Attaching the list item to the UL
              verbList.appendChild(verbListItem);

              // // Verb Example
              if (!Array.isArray(verbExample) || verbExample.length === 0) {
                mainVerbSpan.innerHTML = 'Example not available';
              } else {
                mainVerbSpan.innerHTML = `"${verbExample}"`;
              }
            });
          });

        // Append the UL list to the container
        mainVerbListContainer.appendChild(verbList);

        const verbSrcUrl = data[0].sourceUrls;
        srcUrl.innerHTML = verbSrcUrl;

        srcLink.href = verbSrcUrl;
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
});
