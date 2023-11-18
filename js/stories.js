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
        ${generateStarMarkup(currentUser, story)}
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

/** Takes in user and story, returns filled or unfilled star inline
 * if user is logged in, returns unfilled star,
 * if story is user's favorite, returns filled star,
 * otherwise, returns empty markup.
*/

function generateStarMarkup(user, story) {
  console.log("whatIsStory", story);
  if (user) {
    if (user.favorites.some(s => s.storyId === story.storyId)) {
      return `<i class="bi bi-star-fill"></i>`;
    } else {
      return `<i class="bi bi-star"></i>`;
    }
  }
  return "";
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
  console.debug("getStorySubmission=", evt);
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
  $submitForm.fadeOut("slow");
}

$submitForm.on("submit", getAndSubmitStory);

/** Gets list of favoritestories from server, generates their HTML, and \
 * puts on page. */

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
      console.log("generateStory", $story);
      $favoritesList.prepend($story);
    }
  }
  $favoritesList.show();
}

$allStoriesList.on("click", ".star", toggleFavoriteClick);
$favoritesList.on("click", ".star", toggleFavoriteClick);


/** Changes star markup of clicked stories depending on whether the story
 *  is being favorited or unfavorited. */

async function toggleFavoriteClick(evt) {
  console.log("I did get clicked");

  const storyId = $(evt.target).closest(".story-data").attr("id");
  const starStatus = $(evt.target).closest(".bi");

  const cacheOldStory = await Story.getRemovedStories(storyId);
  const clickedStory = (storyList.stories.find(s => s.storyId === storyId) ||
    cacheOldStory);

  if (starStatus.hasClass("bi-star")) {
    currentUser.addFavorite(clickedStory);
    starStatus.toggleClass("bi-star bi-star-fill");
  } else {
    starStatus.toggleClass("bi-star bi-star-fill");
    currentUser.unFavorite(clickedStory);
  }
}

