$(document).ready(function() {
  const count = $(".counter").val();
  $('#tweet-text').keyup(() => {
    let string = $("#tweet-text").val();
    $('.counter').val(count - string.length);
    if (string.length > 140) {
      $(`.counter`).css('color', 'red');
    }
    if (string.length <= 140) {
      $(`.counter`).css('color', 'rgb(182, 176, 167)');
    }
  });
});