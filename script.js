// import axios from "/axios";
// async function fetchGH() {
//   const response = await fetch(
//     "https://api.github.com/repos/facebook/react/issues",
//     {
//       headers: {
//
//       },
//     }
//   );
//   return await response.json();
// }
// fetchGH();

let input = document.getElementById("input");
let input2 = document.getElementById("input2");
let button = document.getElementById("button");

function toggleFade() {
  const element1 = document.getElementById("main");
  const element2 = document.getElementById("main2");

  element1.classList.toggle("fade-in");
  element1.classList.toggle("fade-out");
  element2.classList.toggle("fade-in");
  element2.classList.toggle("fade-out");

  setTimeout(() => {
    element1.classList.toggle("hidden");
    element2.classList.toggle("hidden");
    element1.classList.toggle("active");
    element2.classList.toggle("active");
  }, 500);
}

let name1 = document.getElementById("name");
let usernamename = document.getElementById("username");
let bio = document.getElementById("bio");
let username_url = document.getElementById("username-url");
let profile_pic = document.getElementById("profile-pic");

function setData() {
  let p = fetch(`https://api.github.com/users/${input.value}`);
  p.then((response) => response.json())
    .then((data) => {
      name1.innerHTML = data.name;
      usernamename.innerHTML = data.login;
      bio.innerHTML = data.bio;
      username_url.setAttribute("href", data.html_url);
      profile_pic.setAttribute("src", data.avatar_url);
      input2.setAttribute("value", data.login);
    })
    .catch((error) => console.log("Error:", error));
}

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    toggleFade();
    setData();
  }
});
input2.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    toggleFade();
    setData();
  }
});
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    toggleFade();
    setData();
  }
});
button.addEventListener("click", function () {
  toggleFade();
  setData();
});
// const APIURL = "https://api.github.com/users/";
// const main = document.querySelector("#main");
// const getUser = async (username) => {
//   const response = await fetch(APIURL + username);
//   const data = await response.json();
//   console.log(data);
// };
// getUser("pranjalgupta4");

// axios
//   .get("https://api.github.com/users/pranjalgupta4", {
//
//   })
//   .then((res) => {
//     console.log(res.data);
//   });
