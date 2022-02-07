const search_btn = document.getElementById('book_btn');
const input = document.getElementById('book_input');
search_btn.addEventListener('click', () => findBooks());
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    findBooks();
    return;
  }
  return null;
});