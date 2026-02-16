// Charger les articles
fetch('data/articles.json')
  .then(res => res.json())
  .then(data => {
    const inputs = document.querySelectorAll(".searchInput");

    // fonction simple pour comparer avec tolérance aux fautes (distance de Levenshtein simplifiée)
    function simpleMatch(str, query) {
      str = str.toLowerCase();
      query = query.toLowerCase();
      if(str.includes(query)) return true;
      // tolérance : permet 1 caractère incorrect
      let errors = 0;
      for(let i=0;i<Math.min(str.length,query.length);i++){
        if(str[i]!==query[i]) errors++;
        if(errors>1) return false;
      }
      return true;
    }

    // Vérifier correspondance titre, description, ou keywords
    function matchArticle(article, query) {
      if(simpleMatch(article.title, query)) return true;
      if(simpleMatch(article.description, query)) return true;
      for(let kw of article.keywords){
        if(simpleMatch(kw, query)) return true;
      }
      return false;
    }

    inputs.forEach(input => {
      const suggestions = input.parentElement.querySelector(".suggestions");

      input.addEventListener("input", () => {
        const query = input.value.trim();
        suggestions.innerHTML = '';
        if(query.length < 2) return;

        const results = data.filter(a => matchArticle(a, query));

        results.slice(0,5).forEach(article => {
          const div = document.createElement("div");
          div.className = "suggestion-item";
          div.innerHTML = `<a href="${article.url}"><strong>${article.title}</strong><br><small>${article.description}</small></a>`;
          suggestions.appendChild(div);
        });
      });
    });
  })
  .catch(err => console.error("Erreur chargement articles :", err));
