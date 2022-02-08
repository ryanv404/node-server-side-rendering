const findBooks = async () => {
  try {
    const input = document.getElementById('book_input');
    const results = document.getElementById('book_results');
    const searchTerms = input.value;
    input.value = '';
    const html = await getBooks(searchTerms);
    results.innerHTML = html;
    return;
  } catch (error) {
    console.log(error);
  }
};

// const search_btn = document.getElementById('book_btn');
// const input = document.getElementById('book_input');
// search_btn.addEventListener('click', () => findBooks());
// input.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter'){
//     findBooks();
//     return;
//   }
//   return null;
// });
