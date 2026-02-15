fetch("data/articles.json")
  .then(response => response.json())
  .then(data => {

    const idx = lunr(function () {
      this.ref("id")
      this.field("title")
      this.field("content")

      data.forEach(doc => this.add(doc))
    })

    const input = document.getElementById("searchInput")
    const suggestions = document.getElementById("suggestions")

    input.addEventListener("input", function () {
      const query = input.value

      if (query.length < 2) {
        suggestions.innerHTML = ""
        return
      }

      const results = idx.search(query)
      suggestions.innerHTML = ""

      results.forEach(result => {
        const article = data.find(a => a.id === result.ref)

        const div = document.createElement("div")
        div.className = "suggestion-item"
        div.innerHTML = `<a href="${article.url}">${article.title}</a>`

        suggestions.appendChild(div)
      })
    })
  })
