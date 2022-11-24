//Global variables
const apiUrl = "http://localhost:5678/api";
let userData = JSON.parse(window.sessionStorage.getItem("userData"));

//Buttons
const exitModalBtn = document.getElementsByClassName("exitButton");
const returnModalBtn = document.getElementsByClassName("returnButton")[0];
const logOutBtn = document.getElementsByTagName("li")[2];
const deleteWorksBtn = document.getElementById("deleteAllWorksBtn");
const submitWorkBtn = document.getElementById("submitWork");
const workImageBtn = document.getElementById("imageUploadArea");
const modifyGalleryBtn = document.getElementsByClassName("fa-pen-to-square")[3];
const addWorkBtn = document.getElementById("addPictureBtn");
const publishChangesBtn = document.getElementById("publishChangesBtn");

//Containers
const galleryContainer = document.getElementsByClassName("gallery")[0];
const modalGalleryContainer =
  document.getElementsByClassName("modalGallery")[0];
const workImageDetailsContainer = document.getElementById(
  "uploadImageDetailsContainer"
);
const workImagePreviewContainer = document.getElementById(
  "uploadimagePreviewContainer"
);
const imageSrc = document.getElementById("image");
const modalAddWorks = document.getElementById("modalAddWork");
const modalDeleteWorks = document.getElementById("modalDeleteWork");
const modalsContainer = document.getElementById("modals");

let works;
let modifiedWorks = [];
let allWorksLength;
//let tempImageUrl;
let tempImage;
let formDataArray = [];

//Get Data
async function getAllWorks() {
  try {
    let res = await fetch(apiUrl + "/works");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
function getTitle() {
  return document.getElementById("title-Input").value;
}
function getCategoryId() {
  return document.getElementById("dropdown-Category").value;
}

//Initialize Data
async function initializeWorks() {
  works = await getAllWorks();
  works.forEach((work) => {
    let tempWork = {
      id: work.id,
      imageUrl: work.imageUrl,
      title: work.title,
      categoryId: work.category.id,
      method: "INITIAL",
    };
    modifiedWorks.push(tempWork);
  });
  renderGallery();
}
initializeWorks();

//Store temporary changes
function previewImg() {
  let files = workImageBtn.files[0];
  if (files) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function () {
      workImagePreviewContainer.innerHTML = '<img src="' + this.result + '" />';
      window.sessionStorage.setItem("imgUrl", JSON.stringify(this.result));
    });
    workImageDetailsContainer.style.display = "none";
  }
  tempImage = workImageBtn.files[0];
}
function deleteWork(index) {
  for (let i = 0; i < modifiedWorks.length; i++) {
    if (modifiedWorks[i].id == index) {
      modifiedWorks[i].method = "DELETE";
    }
  }
}
function addWork(inputPhoto, inputTitle, inputCategory) {
  let worksLenght = modifiedWorks.length - 1;
  let inputId = modifiedWorks[worksLenght].id + 1;
  let tempWork = {
    id: inputId,
    imageUrl: inputPhoto,
    title: inputTitle,
    categoryId: inputCategory,
    method: "POST",
  };
  modifiedWorks.push(tempWork);
}
function pushIntoFormDataArray(tempFormData) {
  let worksLenght = modifiedWorks.length - 1;
  let inputId = modifiedWorks[worksLenght].id;
  tempFormData.append("image", tempImage);
  tempFormData.append("id", inputId);
  formDataArray.push(tempFormData);
}

//POST or DELETE work
async function POSTwork(work) {
  let counter = 0;
  for (let i = 0; i < formDataArray.length; i++) {
    if (work.id == formDataArray[i].get("id")) {
      counter = i;
      formDataArray[i].delete("id");
    }
  }
  try {
    await fetch(apiUrl + "/works", {
      method: work.method,
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + userData.token,
      },
      body: formDataArray[counter],
    });
  } catch (error) {
    console.error(error);
  }
}
async function DELETEwork(work) {
  try {
    await fetch(apiUrl + "/works/" + work.id, {
      method: work.method,
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + userData.token,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
async function applyChanges() {
  modifiedWorks.forEach((modifiedWork) => {
    if (modifiedWork.method == "POST") {
      POSTwork(modifiedWork);
    } else if (modifiedWork.method == "DELETE") {
      DELETEwork(modifiedWork);
    }
  });
}

//Render galleries function
function renderGallery() {
  let html = "";
  let htmlSegment = "";
  let imageUrl = "";
  modifiedWorks.forEach((modifiedWork) => {
    if (modifiedWork.method != "DELETE") {
      imageUrl = modifiedWork.imageUrl.replace(
        "http://localhost:5678",
        "../Backend"
      );
      htmlSegment =
        '<figure> <img src="' +
        imageUrl +
        '"alt="' +
        modifiedWork.title +
        '"> <figcaption>' +
        modifiedWork.title +
        "</figcaption> </figure>";
      html += htmlSegment;
    }
  });
  galleryContainer.innerHTML = html;
}
function renderModalGallery() {
  let html = "";
  let htmlSegment = "";
  let imageUrl = "";
  modifiedWorks.forEach((modifiedWork) => {
    if (modifiedWork.method != "DELETE") {
      imageUrl = modifiedWork.imageUrl.replace(
        "http://localhost:5678",
        "../Backend"
      );
      htmlSegment =
        '<figure> <img src="' +
        imageUrl +
        '"alt="' +
        modifiedWork.title +
        '"> <figcaption> éditer </figcaption> <input type="checkbox" class="deleteCheckbox" id="' +
        modifiedWork.id +
        '"> <i class="fa-solid fa-trash-can"> </i></figure>';
      html += htmlSegment;
    }
  });
  modalGalleryContainer.innerHTML = html;
}
function resetAddWork() {
  workImageDetailsContainer.style.display = "flex";
  workImagePreviewContainer.innerHTML = "";
}

//LogOut
logOutBtn.addEventListener("click", () => {
  window.sessionStorage.setItem("userData", "");
  window.location.href = "./index.html";
});

//Open modal
modifyGalleryBtn.onclick = function () {
  modalsContainer.style.display = "block";
  modalDeleteWorks.style.display = "flex";
  renderModalGallery();
};
addWorkBtn.onclick = function () {
  modalAddWorks.style.display = "flex";
  modalDeleteWorks.style.display = "none";
};

//Close modals
exitModalBtn[0].onclick = function () {
  modalsContainer.style.display = "none";
  modalDeleteWorks.style.display = "none";
  modalAddWorks.style.display = "none";
  resetAddWork();
  renderModalGallery();
};
exitModalBtn[1].onclick = function () {
  modalsContainer.style.display = "none";
  modalDeleteWorks.style.display = "none";
  modalAddWorks.style.display = "none";
  resetAddWork();
  renderModalGallery();
};
window.onclick = function (event) {
  if (event.target == modalsContainer) {
    modalsContainer.style.display = "none";
    modalAddWorks.style.display = "none";
    modalDeleteWorks.style.display = "none";
    resetAddWork();
    renderGallery();
  }
};

//Return modal
returnModalBtn.onclick = function () {
  modalAddWorks.style.display = "none";
  modalDeleteWorks.style.display = "flex";
  renderModalGallery();
  resetAddWork();
};

//Delete work
modalGalleryContainer.onclick = function () {
  console.log("cliked");
  let deleteCheckbox = document.getElementsByClassName("deleteCheckbox");
  for (let i = 0; i < deleteCheckbox.length; i++) {
    if (deleteCheckbox[i].checked) {
      console.log("cliked2");
      deleteWork(deleteCheckbox[i].id);
    }
  }
  //
  let fff = modifiedWorks.length - 1;
  console.log(modifiedWorks, modifiedWorks[fff].id);
  //
  renderModalGallery();
};
deleteWorksBtn.onclick = function () {
  for (let i = 0; i <= modifiedWorks.length; i++) {
    deleteWork(modifiedWorks[i].id);
  }
  renderModalGallery();
};

//Preview work image
workImageBtn.onchange = function () {
  previewImg(this);
};

//Add work
modalAddWorks.addEventListener("submit", function (event) {
  //console.log("clicked");
  event.preventDefault();
  let title = getTitle();
  let categoryId = getCategoryId();
  let imageUrl = sessionStorage.getItem("imgUrl");
  imageUrl = imageUrl.replaceAll('"', "");
  if (title != "" && imageUrl != "") {
    tempFormData = new FormData(this);
    addWork(imageUrl, title, categoryId);
    pushIntoFormDataArray(tempFormData);
    resetAddWork();
  }
});

//Publish changes
publishChangesBtn.onclick = function () {
  applyChanges();
};
