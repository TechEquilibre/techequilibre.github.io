let idx;
let documents = [];

function normalize(text) {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

fetch('data/search.json')
  .then(res => res.json())
  .then(data => {

    documents = data.map(doc => ({
      ...doc,
      searchField: normalize(doc.title + " " + doc.description)
    }));

    idx = lunr(function () {
      this.ref('id');
      this.field('searchField', { boost: 10 });

      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);

      documents.forEach(doc => this.add(doc));
    });
  });

const input = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestions');

let timer;

input.addEventListener('input', function () {

  clearTimeout(timer);

  timer = setTimeout(() => {

    const query = normalize(this.value);

    if (query.length < 2) {
      suggestionsBox.innerHTML = "";
      return;
    }

    const results = idx.search(query + "* " + query + "~1");

    suggestionsBox.innerHTML = "";

    results.slice(0, 6).forEach(result => {

      const doc = documents.find(d => d.id === result.ref);

      suggestionsBox.innerHTML += `
        <div class="suggestion-item">
          <a href="${doc.url}">
            <strong>${doc.title}</strong><br>
            <small>${doc.description}</small>
          </a>
        </div>
      `;
    });

  }, 150);
});
