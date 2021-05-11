//function for creating the tweet element
const createTweetElement = function(tweet) {
  const date = $.timeago(new Date(tweet.created_at));
  const $tweet = `
  <article class="feed">
  <div class="tweet-header">
    <img src=${tweet.user.avatars}>
    <span>${tweet.user.name}</span>
    <span id="at" class="fright">${tweet.user.handle}</span>
  </div>
  <div class="tweet-body">${escape(tweet.content.text)}</div>
  <footer class="tweet-footer">
  <span>${date}</span>
  <div id="tweet-buttons" class="fright">
  <img src="/images/notification.png">
  <img src="/images/retweetIcon.png">
  <img src="/images/heart.png">
  </div>
  </footer>
  </article>
  `;
  return $tweet;
};

//function for escaping user input strings to prevent xss attacks
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//function for submitting new tweet to the feed, if allowed
$(document).ready(function() {
  $("form").on("submit", function(event) {
    event.preventDefault();
    hideError();
    const text = $(this.children[1]).val().trim();
    const $string = $(this).serialize();
    if (text.length > 140) {
      renderError("Exceeded maximum character count!");
    } else if (text === "" || text === null) {
      renderError("Please enter text before you can tweet.");
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $string
      })
        .done(() => {
          loadRecentTweet();
          $("#tweet-text").val('');
          $(".counter").val(140);
        })
        .fail(error => console.log(error));
    }
  });

  //hides error message, and called within document.ready
  const hideError = function() {
    $(".error").hide();
  };
  hideError();

  //shows error message when called
  const renderError = function(msg) {
    $(".error").slideDown().text(msg);
  };

  // renders the most recent tweet
  const renderRecentTweet = function(tweet) {
    $("#main-feed").prepend(createTweetElement(tweet));
  };

  // loads the most recent tweet
  const loadRecentTweet = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET'
    })
      .done((data) => {
        renderRecentTweet(data[data.length - 1]);
      })
      .fail(error => console.log(error));
  };

  //loads tweets for rendering, called within document.ready to load initial tweets
  const loadTweets = function() {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(tweets) {
        renderTweets(tweets);
      });
  };
  loadTweets();
});

//function for rendering tweets to the page
const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    $("#main-feed").prepend(createTweetElement(tweet));
  }
};