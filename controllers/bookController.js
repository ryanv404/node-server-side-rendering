const getBooksHome = (req, res) => {
  return res.render('books', {title: "Book Finder"});
}

module.exports = {
  getBooksHome
};