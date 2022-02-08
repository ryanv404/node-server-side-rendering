const axios = require('axios');
require('dotenv').config();

const getBooks = async (searchTerm) => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?${searchTerm}&key=${process.env.GOOGLE_API_KEY}`;
    let response = await axios.get(url);
    bookList = response.data.items;
    let data = [];
    if (bookList) {
      for (let book of bookList) {
        data.push({
          title: book.volumeInfo.title || '',
          author: book.volumeInfo.authors || '',
          publisher: book.volumeInfo.publisher || '',
          publishedDate: book.volumeInfo.publishedDate || '',
          infoLink: book.volumeInfo.infoLink || '',
          thumbnail: book.volumeInfo.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail || '',
          description: book.searchInfo?.textSnippet || 'No description available.'
        });
      }
      return getBooksHTML(data);
    }
    return "No results found.";
  } catch (error) {
    console.log(error);
  }
};

const getBooksHTML = (data) => {
  try {
    let booksHTML = '';
    if (data) {
      data.forEach((book) => {
        booksHTML += `
          <div class="card mb-4 w-75 border border-secondary rounded">
            <img class="card-img-top" src="${book.thumbnail}" alt="${book.title} image">
            <div class="card-body">
              <h5 class="card-title"><a href="${book.infoLink}" class="text-info" target="_blank" style="text-decoration: none;">${book.title}</a></h5>
              <h6 class="card-text">${Array.isArray(book.author) ? book.author.join(', ') : book.author}</h6>
              <p class="card-text"><small class="text-muted">${book.publisher}</small></p>
              <p class="card-text">${book.description}</p>
            </div>
          </div>`;
      });
    }
    return booksHTML;
  } catch (error) {
    console.log(error);
  }
};

const getBooksHome = (req, res) => {
  return res.render('books', {title: "Book Finder", results: null});
};

const searchBooks = async (req, res) => {
  const query = new URLSearchParams(req.query);
  
  const html = await getBooks(query.toString());
  return res.render('books', {title: "Book Finder", results: html});
};

module.exports = {
  getBooksHome,
  searchBooks
};