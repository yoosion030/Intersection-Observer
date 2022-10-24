(() => {
  const $ul = document.querySelector("ul");
  let $li;
  let count = $ul.children.length;

  document.addEventListener("scroll", () => {
    console.log(window.innerHeight);
    console.log(window.scrollY);
    console.log(document.body.offsetHeight);
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      $li = $ul.appendChild(document.createElement("li"));
      $li.textContent = ++count;
    }
  });
})();
