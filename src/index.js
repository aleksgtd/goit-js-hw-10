import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  list: document.querySelector('ul.country-list'),
  card: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputFn, DEBOUNCE_DELAY));

function onInputFn(e) {
  e.preventDefault();
  let name = '';
  name = e.target.value.trim();
  onCountrySearch(name);
}

function onCountrySearch(name) {
  let urlName = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  fetchCountries(urlName)
    .then(r => r.json())
    .then(d => {
      if (d.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        throw new Error();
      } else {
        onCountryCount(d);
      }
    })
    .catch(e => {
      onMarkupDelete();
    });
}

function onCountryCount(array) {
  if (array.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (array.length >= 2 && array.length <= 10) {
    onListMarkup(array);
    return;
  } else {
    onCardMarkup(array);
    return;
  }
}

function onMarkupDelete() {
  refs.list.innerHTML = '';
  refs.card.innerHTML = '';
}

function onListMarkup(array) {
  onMarkupDelete();
  refs.list.style.listStyleType = 'none';
  array.forEach(({ flags, name }) => {
    refs.list.insertAdjacentHTML(
      'beforeend',
      `<li style="list-style-type: none;"><img src=${flags.png} alt='Flag of ${name.official}' width='36'> <span style="font-size: 20px;">${name.official}</span><li/>`,
    );
  });
}

function onCardMarkup(array) {
  onMarkupDelete();
  refs.card.insertAdjacentHTML(
    'beforeend',
    `<div><img src=${array[0].flags.png} alt='Flag of ${
      array[0].name.official
    }' width='300'></div> <div style="font-size: 50px; font-weight: bold">${
      array[0].name.official
    }</div> <div style="font-size: 30px;"><span style="font-weight: bold">Capital:</span> ${
      array[0].capital[0]
    }</div> <div style="font-size: 30px;"><span style="font-weight: bold">Languages:</span> ${Object.values(
      array[0].languages,
    )
      .toString()
      .split(',')
      .join(
        ', ',
      )}</div> <div style="font-size: 30px;"><span style="font-weight: bold">Population:</span> ${
      array[0].population
    } </div>`,
  );
}
