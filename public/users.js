const get_all_btn = document.getElementById("get_all_users");
const show_me_btn = document.getElementById("show_me");
const result = document.getElementById("result");
const baseURL = "http://localhost:3000/api/v1/users";
const displayFields = ["username", "name", "first_name", "last_name", "email", "role", "isVerified"];

const formatItem = (item) => {
  switch (item) {
    case true: 
      return `<span class="text-success">${item}</span>`;
    case false: 
      return `<span class="text-danger">${item}</span>`;
    case "user": 
      return `<span class="text-info">${item}</span>`;
    case "admin": 
      return `<span class="text-warning">${item}</span>`;
    default:
      return item;
  };
};

const formatUserList = (usersList) => {
  let output = '';

  usersList.forEach((user, index) => {
    let itemHTML = '';
    (Object.entries(user)).forEach(item => {
      (item.length > 1 && displayFields.includes(item[0]))
        ? itemHTML += `<li>${item[0]}: ${formatItem(item[1])}</li>`
        : null;
    });
    output += `
    <li><a href="${baseURL}/${user._id}" class="text-decoration-none" target="_blank">User ${index + 1}</a>
      <ul>${itemHTML}</ul>
    </li>`
  });

  return output;
};

const getAllUsers = async () => {
  try {
    const response = await axios.get(baseURL);
    const users = await response.data.users;
    result.innerHTML = formatUserList(users);
  } catch (error) {
    console.log(error);
  }
};

const showMe = async () => {
  try {
    const response = await axios.get(`${baseURL}/me`);
    const users = await response.data.user;
    let userHTML = '<span class="text-success">Current User</span><ul>';

    (Object.entries(users)).forEach(item => {
      (item.length > 1 && displayFields.includes(item[0]))
        ? userHTML += `<li>${item[0]}: ${formatItem(item[1])}</li>`
        : null;
    });

    userHTML += "</ul>"
    result.innerHTML = userHTML;
  } catch (error) {
    console.log(error);
  }
};

get_all_btn.addEventListener('click', getAllUsers);
show_me_btn.addEventListener('click', showMe);