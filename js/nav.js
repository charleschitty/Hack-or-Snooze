"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show submit form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  evt.preventDefault();
  console.log("clicked");
  hidePageComponents();
  $submitForm.show();
  $allStoriesList.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show list of favorites on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $navFavorites.show();
  putFavStoriesOnPage();
}

$navFavorites.on("click", navFavoritesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
