require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const getBooks = async (searchTerm) => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${process.env.GOOGLE_API_KEY}`;
    let response = await axios.get(url);
    bookList = response.data.items;
    let data = [];
    for (let book of bookList) {
      data.push({
        title: book.volumeInfo.title || '',
        author: book.volumeInfo.authors || '',
        publisher: book.volumeInfo.publisher || '',
        publishedDate: book.volumeInfo.publishedDate || '',
        infoLink: book.volumeInfo.infoLink || '',
        thumbnail: book.volumeInfo.imageLinks.thumbnail || '',
        description: book.searchInfo?.textSnippet || 'No description available.'
      })
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getBooksHTML = async () => {
  try {
    const data = await getBooks('harry+potter');
    let booksHTML = '';
    data.forEach((book) => {
      booksHTML += `
        <div style="width: 50%; margin-left: auto; margin-right: auto; border: 1px solid black; margin-bottom: 2rem; padding: 1rem;">
          <img style="display: block; width: 50%; margin: 1rem auto 2rem;" src="${book.thumbnail}">
          <h2><a href="${book.infoLink}" target="_blank" style="text-decoration: none; color: darkblue;">${book.title}</a></h2>
          <h4>${Array.isArray(book.author) ? book.author.join(', ') : book.author}</h4>
          <small>${book.publisher}</small>
          <p>${book.description}</p>
        </div>`
    })
    return booksHTML;
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  const html = await getBooksHTML();
  fs.writeFileSync("books.html", html);
})();
