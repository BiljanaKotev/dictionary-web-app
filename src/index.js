let api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en';

let searchbarForm = document.getElementById('searchbar__form');

let word = document.getElementById('main__header');
let phonetics = document.getElementById('main__span');
let meaning = document.getElementById('main__meaning');
let definitions = document.querySelectorAll('.main__listing');
let mainListContainer = document.getElementById('main__list__container');
let synonymsSpan = document.getElementById('main__synonyms__span');
console.log('synonyms-container', synonymsSpan);

searchbarForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let searchbarInput = document.getElementById('searchbar__input').value;

  if (searchbarInput === '') {
    alert('Please enter a word to search for.');
  } else {
    fetch(`${api_url}/${searchbarInput}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        console.log(data[0].meanings[0].definitions);
        // Handle the data from the API here
        word.innerHTML = data[0].word;
        phonetics.innerHTML = data[0].phonetics[1].text;

        mainListContainer.innerHTML = '';
        const definitions = data[0].meanings[0].definitions;
        const list = document.createElement('ul');
        list.className = 'main__list';

        const meanings = data[0].meanings;
        console.log('meanings', meanings);

        meanings
          .filter((meaning) => {
            return meaning.partOfSpeech === 'noun';
          })
          .forEach((meaning) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = meaning.definitions[0].definition;
            list.appendChild(listItem);
          });

        // Append the list to the container
        mainListContainer.appendChild(list);

        // Span
        synonymsSpan.innerHTML = meanings;
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
});
