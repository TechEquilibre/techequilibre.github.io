fetch("../data/articles.json")
  .then(res => res.json())
  .then(data => {

    // Synonymes simples
    const synonyms = {
      "materiel": "composants",
      "pc": "ordinateur"
    }

    // Création index Lunr
    const idx = lunr(function () {
      this.ref("id")
      this.field("title")
      this.field("description")

      data.forEach(doc => this.add(doc))
    })

    // Toutes les barres
    const inputs = document.querySelectorAll(".searchInput")

    inputs.forEach(input => {
      const suggestions = input.parentElement.querySelector(".suggestions")

      input.addEventListener("input", function () {
        let query = input.value.trim().toLowerCase()
        if(query.length < 2) { suggestions.innerHTML=""; return; }

        // Remplace par synonymes
        Object.keys(synonyms).forEach(word => {
          if(query.includes(word)) query = query.replace(word, synonyms[word])
        })

        // Recherche avec tolérance
        const results = idx.search(query + "*") // le * permet recherche partielle

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

  })
  .catch(err => console.error("Erreur chargement articles :", err))
