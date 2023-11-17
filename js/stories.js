"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}" class="story-data">
        <span class="star">
          <i class="bi bi-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle story form submission, if form has valid inputs - author, title, url,
 * and currentUser, it will call addStory and add it to the stories' list. */

async function getAndSubmitStory(evt) {
  // console.debug("getStorySubmission=", evt);
  evt.preventDefault();

  // grab the author, title, url
  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();

  // grab current user
  console.log("whatIsUser=", currentUser);
  console.log("currentStory=", currentUser, { title, author, url });

  const currentStory = await storyList.addStory(
    currentUser,
    { title, author, url }
  );
  const $story = generateStoryMarkup(currentStory);
  $allStoriesList.prepend($story);

  $submitForm.trigger("reset");
}

$submitForm.on("submit", getAndSubmitStory);

/** Gets list of favoritestories from server, generates their HTML, and puts on page. */
function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $favoritesList.empty();
  const favoriteStories = currentUser.favorites;
  console.log("favStories=", favoriteStories);
  if (favoriteStories.length === 0) {
    $favoritesList.append("<h5> No favorites added! </h5>");
  } else {
    // loop through all of our stories and generate HTML for them
    for (let story of favoriteStories) {
      const $story = generateStoryMarkup(story);
      console.log("generateStory", $story)
      $favoritesList.append($story);
    }
  }
  $favoritesList.show();
}

$allStoriesList.on("click",".star", toggleFavoriteClick);

//toggle
//fill/unfill star
//unfavorites if statements

function toggleFavoriteClick(evt){
  console.log("I did get clicked");
  const storyId = $(evt.target).closest(".story-data").attr("id");
  const starStatus = $(evt.target).closest("i")
  //const starStatus = $(evt.target).closest("i").toggleClass("-fill");
  console.log("starStatus=",starStatus)
  const clickedStory = storyList.stories.find(
    story => story.storyId === storyId);

  console.log("story=", clickedStory);

  if (currentUser.favorites.includes(clickedStory)){
    starStatus.removeClass("bi-star-fill").addClass("bi-star");
    currentUser.unFavorite(clickedStory);
    console.log("unfavorited")

    // return false;
  } else {
    starStatus.removeClass("bi-star").addClass("bi-star-fill");
    currentUser.addFavorite(clickedStory);
    console.log("addedFavorite")

    // return true;
  }

}


// $("span").toggleClass("fill")
// const span = document.querySelector("span");
// const classes = span.classList;

// span.addEventListener("click", () => {
//   const result = classes.toggle("c");
//   span.textContent = `'c' ${
//     result ? "added" : "removed"
//   }; classList is now "${classes}".`;
// });