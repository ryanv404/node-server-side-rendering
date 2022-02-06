module.exports = {
  directives: {
    scriptSrc: [
      "'self'",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/",
      "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js", 
      "https://kit.fontawesome.com/",
    ],
    connectSrc: [
      "http://localhost:3000/api/v1/users", 
      "http://localhost:3000/api/v1/users/me", 
      "https://ka-f.fontawesome.com/releases/"
    ],
    upgradeInsecureRequests: null
  },
};