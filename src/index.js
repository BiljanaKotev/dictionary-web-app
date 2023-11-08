let api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en';

let searchbarForm = document.getElementById('header__searchbar__form');

let word = document.getElementById('main__header');
let phoneticsSpan = document.getElementById('main__span');
let meaning = document.getElementById('main__meaning');
let mainListContainer = document.getElementById('main__list__container');
let synonymsSpan = document.getElementById('main__synonyms__span');
console.log('synonyms-container', synonymsSpan);

searchbarForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let searchbarInput = document.getElementById('header__searchbar__input').value;

  if (searchbarInput === '') {
    alert('Please enter a word to search for.');
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

        mainListContainer.innerHTML = '';

        // Create UL List
        const list = document.createElement('ul');
        list.className = 'main__list';

        const meanings = data[0].meanings;
        meanings
          .filter((meaning) => {
            return meaning.partOfSpeech === 'noun';
          })
          .forEach((meaning) => {
            // we are looping over the data (meanings array within the data array)
            // Create List Item inside the forEach
            // Updating each listitem to the meaning definition
            // Attaching the listitem to the UL
            const listItem = document.createElement('li');
            listItem.innerHTML = meaning.definitions[0].definition;
            console.log('definitions', meaning.definitions[0].definition);
            list.appendChild(listItem);
          });

        // Append the UL list to the container
        mainListContainer.appendChild(list);

        // Span
        console.log('synonyms', data[0].meanings[0].synonyms);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
});
