let main = document.querySelector(".main");

// ||Adding data to Array
let cardCollection = new Array();
let allKeys = Object.keys(localStorage);
for (let i = 1; i < localStorage.length + 1; i++) {
  if (/^entry\d+$/.test(allKeys[i - 1])) {
    cardCollection.push(JSON.parse(localStorage.getItem(allKeys[i - 1])));
  }
}

// ||Setting CSS variable values
let width = window
  .getComputedStyle(document.getElementsByTagName("main")[0])
  .width.match(/\d+/)[0];
document.documentElement.style.setProperty("--width-main", `${width}px`);
document.documentElement.style.setProperty(
  "--width",
  `${window.getComputedStyle(main).width.match(/\d+/)[0] / 17}px`
);

// ||Function to check if the entry is null
function ifNull(entry) {
  if (entry === null) {
    return "";
  }
  return entry;
}

// ||Adding cards to main

for (let i = 1; i < cardCollection.length + 1; i++) {
  let dataset = JSON.parse(localStorage.getItem(`entry${i}`));
  let card = `<div class="profile profile2" id="card${i}">
                <img src="${dataset.avatar_url}" alt="" />
                <h3>${ifNull(dataset.name)}</h3>
                <a href="${dataset.html_url}" target="_blank">@${
    dataset.login
  }</a>
                <p id="bio${i}">${ifNull(dataset.bio)}</p>
              </div>`;
  main.innerHTML += card;
}

// ||Calling the elements
main = document.querySelector(".main");
let button = document.getElementById("button");
let error = document.querySelector(".error");
let onsearchName = document.getElementById("onsearch-name");
let onsearchUsername = document.getElementById("onsearch-username");
let onsearchBio = document.getElementById("onsearch-bio");
let onsearchPic = document.getElementById("onsearch-pic");
let profileOnsearch = document.getElementById("profile-onsearch");
let searchProfile = document.getElementById("search-profile");
let headerIcon = document.getElementById("header-icon");
let input = document.getElementById("input");
let historyList = document.getElementById("history-list");
let history = document.getElementById("history");

// ||Adding event listeners to the history elements
document.getElementById("history-icon").addEventListener("click", function () {
  history.classList.remove("hidden");
  setTimeout(function () {
    history.classList.remove("history-hidden");
    history.classList.add("history");
  }, 1);
});

document.getElementById("clear-all").addEventListener("click", function () {
  localStorage.clear();
  cardCollection = [];
  location.reload();
});

document
  .getElementById("close-history")
  .addEventListener("click", removeHistory);

// ||Function to remove history bar
function removeHistory() {
  history.classList.add("history-hidden");
  setTimeout(() => {
    history.classList.remove("history");
    history.classList.add("hidden");
  }, 500);
}

// ||Adding username to history
for (let i = 1; i < cardCollection.length + 1; i++) {
  let dataset = JSON.parse(localStorage.getItem(`entry${i}`));
  let listItem = `<a href="${dataset.html_url}" target="_blank">@${dataset.login}</a>
                  <img src="img/cancel.png" alt="" id="liImg${i}" />`;
  let listItemDiv = document.createElement("li");
  listItemDiv.innerHTML = listItem;
  listItem.id = `li${i}`;
  historyList.appendChild(listItemDiv);
  addListenerToListItem(i);
}

// ||Function to add listener to the list items
function addListenerToListItem(i) {
  document.getElementById(`liImg${i}`).addEventListener("click", function () {
    ind = parseInt(this.id.match(/\d+/)[0], 10);
    localStorage.removeItem(`entry${ind}`);
    cardCollection.splice(ind - 1, 1);
    for (let j = ind; j < cardCollection.length + 1; j++) {
      let data = localStorage.getItem(`entry${j + 1}`);
      localStorage.setItem(`entry${j}`, data);
      localStorage.removeItem(`entry${j + 1}`);
      document.getElementById(`card${j + 1}`).id = `card${j}`;
      document.getElementById(`bio${j + 1}`).id = `bio${j}`;
      document.getElementById(`li${j + 1}`).id = `li${j}`;
      document.getElementById(`liImg${j + 1}`).id = `liImg${j}`;
    }
    historyList.removeChild(document.getElementById(`li${ind}`));
    main.removeChild(document.getElementById(`card${ind}`));
    makeDefault();
    addSearchProfile();
  });
}

// ||Function to fetch data from the API and set data in local storage
async function setData(value) {
  try {
    const response = await fetch(`https://api.github.com/users/${value}`);
    if (!response.ok) {
      error.classList.add("visible");
    } else {
      error.classList.remove("visible");
      removeSearchProfile();

      const data = await response.json();
      onsearchName.innerHTML = data.name;
      onsearchUsername.innerHTML = data.login;
      onsearchUsername.setAttribute("href", data.html_url);
      onsearchBio.innerHTML = data.bio;
      onsearchPic.setAttribute("src", data.avatar_url);

      let index = cardCollection.length + 1;
      ifMatchData(
        data.login,
        function () {
          localStorage.setItem(`entry${index}`, JSON.stringify(data));
          cardCollection.push(data);
        },
        async function () {
          let card = `<img src="${data.avatar_url}" alt="" />
                      <h3>${ifNull(data.name)}</h3>
                      <a href="${data.html_url}" target="_blank">@${
            data.login
          }</a>
                      <p id="bio${index}">${ifNull(data.bio)}</p>`;

          let cardDiv = document.createElement("div");
          cardDiv.innerHTML = card;
          cardDiv.classList.add("profile2");
          cardDiv.classList.add("profile");
          cardDiv.id = `card${index}`;
          main.appendChild(cardDiv);

          let listItem = `<a href="${data.html_url}" target="_blank">@${data.login}</a>
                          <img src="img/cancel.png" alt="" id="liImg${index}" />`;
          let listItemDiv = document.createElement("li");
          listItemDiv.id = `li${index}`;
          listItemDiv.innerHTML = listItem;
          historyList.appendChild(listItemDiv);
          addListenerToListItem(index);
        }
      );
    }
  } catch (err) {
    console.log("Error: ", err);
  }
}

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    setData(input.value);
    removeHistory();
  }
});
button.addEventListener("click", function () {
  setData(input.value);
  removeHistory();
});
headerIcon.addEventListener("click", function () {
  addSearchProfile();
  makeDefault();
  addListenerToCard1();
  removeHistory();
});

// ||Function to make it Default
function makeDefault() {
  for (i = 1; i < cardCollection.length + 1; i++) {
    let oldELe = document.getElementById(`card${i}`);
    let newEle = oldELe.cloneNode(true);
    oldELe.parentNode.replaceChild(newEle, oldELe);
    document.getElementById(`card${i}`).className = "profile profile2";
  }
  addListenerToCard1();
}

// ||Function to add listener to the first card
function addListenerToCard1() {
  if (cardCollection.length > 0) {
    document.getElementById("card1").addEventListener("click", function () {
      removeSearchProfile2();
      profileOnsearch.classList.remove("profile-onsearch");
      profileOnsearch.classList.add("hidden");
    });
    step1(1);
  }
}
addListenerToCard1();

// ||STEPS FOR ANIMATION

// Step 1
function step1(i) {
  let varCard = document.getElementById(`card${i}`);
  let bio = document.getElementById(`bio${i}`);
  bio.classList.add("hidden");
  varCard.classList.add("expand-half");
  setTimeout(function () {
    varCard.classList.remove("profile2");
    varCard.classList.remove("expand-half");
    varCard.classList.add("grid-position1");
  }, 500);
  step2(i);
}

// Step 1 reverse
function reverseStep1(i) {
  let varCard = document.getElementById(`card${i}`);
  varCard.classList.add("colapse-left");
  setTimeout(function () {
    varCard.classList.remove("grid-position1");
    varCard.classList.add("profile2");
    varCard.classList.remove("colapse-left");
  }, 500);
}

// Step 2
function step2(i) {
  let varCard = document.getElementById(`card${i}`);
  varCard.addEventListener(
    "click",
    function () {
      let bio = document.getElementById(`bio${i}`);
      varCard.classList.add("expand");
      setTimeout(() => {
        bio.classList.remove("hidden");
        varCard.classList.remove("expand");
        varCard.classList.remove("profile");
        varCard.classList.remove("grid-position1");
        varCard.classList.add("profile-onsearch");
      }, 500);
      if (i + 1 <= cardCollection.length) step1(i + 1);
      if (i - 1 > 0) step3(i - 1);
    },
    { once: true }
  );
}

// Step 2 reverse
function reverseStep2(i) {
  let varCard = document.getElementById(`card${i}`);
  let bio = document.getElementById(`bio${i}`);
  bio.classList.add("hidden");

  varCard.classList.add("colapse-half-left");
  setTimeout(() => {
    varCard.classList.remove("colapse-half-left");
    varCard.classList.add("profile");
    varCard.classList.add("grid-position1");
    varCard.classList.remove("profile-onsearch");
  }, 500);
  step2(i);
  if (i + 1 <= cardCollection.length) reverseStep1(i + 1);
}

// Step 3
function step3(i) {
  let bio = document.getElementById(`bio${i}`);
  bio.classList.add("hidden");

  let varCard = document.getElementById(`card${i}`);
  varCard.classList.add("colapse-half");
  setTimeout(() => {
    varCard.classList.remove("colapse-half");
    varCard.classList.remove("profile-onsearch");
    varCard.classList.add("profile");
    varCard.classList.add("grid-position2");
  }, 500);

  if (i - 1 < cardCollection.length && i - 1 > 0) step4(i - 1);

  varCard.addEventListener(
    "click",
    function () {
      let varCard = document.getElementById(`card${i}`);
      varCard.classList.add("expand-left");
      setTimeout(() => {
        bio.classList.remove("hidden");
        varCard.classList.remove("expand-left");
        varCard.classList.add("profile-onsearch");
        varCard.classList.remove("profile");
        varCard.classList.remove("grid-position2");
      }, 500);
      reverseStep2(i + 1);
      if (i - 1 < cardCollection.length && i - 1 > 0) reverseStep4(i - 1);
    },
    { once: true }
  );
}

// Step 4
function step4(i) {
  let varCard = document.getElementById(`card${i}`);
  varCard.classList.add("colapse");
  setTimeout(() => {
    varCard.classList.remove("colapse");
    varCard.classList.remove("profile");
    varCard.classList.remove("grid-position2");
    varCard.classList.add("hidden");
  }, 500);
}

// Step 4 reverse
function reverseStep4(i) {
  let varCard = document.getElementById(`card${i}`);
  varCard.classList.remove("hidden");
  varCard.classList.add("profile");
  varCard.classList.add("profile2-left");
  setTimeout(() => {
    varCard.classList.add("expand-half-left");
  }, 1);
  setTimeout(() => {
    varCard.classList.remove("profile2-left");
    varCard.classList.remove("expand-half-left");
    varCard.classList.add("grid-position2");
  }, 500);
}

// ||Function to remove search profile
function removeSearchProfile() {
  searchProfile.classList.add("totop");
  profileOnsearch.classList.add("profile-onsearch");
  profileOnsearch.classList.remove("hidden");

  setTimeout(function () {
    searchProfile.classList.add("search-profile");
    searchProfile.classList.remove("hidden");
    headerIcon.classList.remove("hidden");
  }, 500);
}

function removeSearchProfile2() {
  searchProfile.classList.add("totop");

  setTimeout(function () {
    searchProfile.classList.remove("search-profile");
    searchProfile.classList.add("hidden");
    headerIcon.classList.remove("hidden");
  }, 500);
}

// ||Function to add search profile
function addSearchProfile() {
  searchProfile.classList.remove("hidden");
  headerIcon.classList.add("hidden");
  setTimeout(function () {
    searchProfile.classList.add("search-profile");
    searchProfile.classList.remove("totop");
  }, 1);
  setTimeout(function () {
    profileOnsearch.classList.remove("profile-onsearch");
    profileOnsearch.classList.add("hidden");
  }, 300);
}

// ||Data Match funtion
function ifMatchData(ele, doThis, doThis2) {
  let index = 0;
  for (let i = 1; i < cardCollection.length + 1; i++) {
    let data = JSON.parse(localStorage.getItem(`entry${i}`));
    if (data.login === ele) index++;
  }
  if (index === 0) {
    doThis();
    doThis2();
  }
}
