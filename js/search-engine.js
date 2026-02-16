document.addEventListener("DOMContentLoaded", function() {
  fetch("data/articles.json") // chemin relatif depuis index.html
    .then(res => res.json())
    .then(data => {

      // Création index Lunr
      const idx = lunr(function() {
        this.ref("id")
        this.field("title")
        this.field("description")
        data.forEach(doc => this.add(doc))
      })

      const input = document.querySelector(".searchInput")
      const suggestions = input.parentElement.querySelector(".suggestions")

      input.addEventListener("input", function() {
        const query = input.value.trim()
        if(query.length < 2) { suggestions.innerHTML=""; return; }

        const results = idx.search(query + "*") // recherche partielle
        suggestions.innerHTML = ""

        results.slice(0,5).forEach(r => {
          const article = data.find(a => a.id === r.ref)
          const div = document.createElement("div")
          div.className = "suggestion-item"
          div.innerHTML = `<a href="${article.url}">${article.title}</a><p>${article.description}</p>`
          suggestions.appendChild(div)
        })
      })

    })
    .catch(err => console.error("Erreur chargement articles :", err))
})
