function fetchCountries(name) {
  return fetch(name).then(r => {
    if (!r.ok) {
      throw new Error(r.status);
    }
    return r.json();
  });
}

export { fetchCountries };
