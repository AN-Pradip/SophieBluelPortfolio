const galleryContainer = document.getElementsByClassName("gallery")[0];
const radioListContainer = document.getElementsByClassName(
  "portfolio-FilterContainer"
)[0];
const radioListArray = Array.from(document.getElementsByName("sort"));
const logInBtn = document.getElementsByTagName("li")[2];

const apiUrl = "http://localhost:5678/api";

window.sessionStorage.setItem("userData", "");

async function getAllWorks() {
  try {
    let res = await fetch(apiUrl + "/works");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
async function renderAllWorks() {
  let works = await getAllWorks();
  let html = "";
  let htmlSegment = "";
  let imageUrl = "";
  works.forEach((work) => {
    imageUrl = work.imageUrl.replace("http://localhost:5678", "../Backend");
    htmlSegment =
      '<figure> <img src="' +
      imageUrl +
      '"alt="' +
      work.title +
      '"> <figcaption>' +
      work.title +
      "</figcaption> </figure>";
    html += htmlSegment;
  });
  galleryContainer.innerHTML = html;
}
async function renderCategory(category) {
  let works = await getAllWorks();
  let html = "";
  let htmlSegment = "";
  let imageUrl = "";
  works.forEach((work) => {
    if (work.category.name == category) {
      imageUrl = work.imageUrl.replace("http://localhost:5678", "../Backend");
      htmlSegment =
        '<figure> <img src="' +
        imageUrl +
        '"alt="' +
        work.title +
        '"> <figcaption>' +
        work.title +
        "</figcaption> </figure>";
      html += htmlSegment;
    }
  });
  galleryContainer.innerHTML = html;
}
renderAllWorks();

radioListContainer.addEventListener("click", () => {
  radioListArray.forEach((radio) => {
    if (radio.checked) {
      if (radio.value == "all") {
        renderAllWorks();
      } else {
        renderCategory(radio.value);
      }
    }
  });
});
logInBtn.addEventListener("click", () => {
  window.location.href = "./login.html";
});
