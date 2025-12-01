import "./index.css";
import imageLogo from "../images/logo.svg";
import imageAvatar from "../images/avatar.jpg";
import imagePencil from "../images/pencil.svg";
import imageAdd from "../images/add.svg";
import imageExit from "../images/exit.svg";
import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "4a4150e0-1b5c-48df-a744-8115870883ef",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

const headerProfileLogo = document.querySelector(".header__logo");
const headerProfileAvatar = document.querySelector(".profile__image");
const headerPencilIcon = document.querySelector(".profile__pencil-logo");
const headerAddIcon = document.querySelector(".profile__add-logo");
const headerExitIcons = document.querySelectorAll(".modal__exit-logo");

headerExitIcons.forEach((icon) => {
  icon.src = imageExit;
});

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__post-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");
const editProfileCloseModal = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".add-card-form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);

const modalOverlayClose = document.querySelectorAll(".modal");

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeClose);
}

function handleEditFormSubmit(e) {
  e.preventDefault();
  profileName.textContent = editProfileNameInput.value;
  profileDescription.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

function handleAddCardSubmit(e) {
  e.preventDefault();
  const inputValues = { link: cardLinkInput.value, name: cardNameInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  e.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card__list-item")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__description");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__button");
  const cardDiscardButton = cardElement.querySelector(".card__discard-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__heart-logo_liked");
  });
  cardDiscardButton.addEventListener("click", () => {
    cardElement.remove();
  });
  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionElement.textContent = data.name;
    previewModalImageElement.src = data.link;
    previewModalImageElement.alt = data.name;
  });

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});
editProfileCloseModal.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

function handleEscapeClose(e) {
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);

modalOverlayClose.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);

headerProfileLogo.src = imageLogo;
headerProfileAvatar.src = imageAvatar;
headerPencilIcon.src = imagePencil;
headerAddIcon.src = imageAdd;
