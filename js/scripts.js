var proxyUrl = "https://frozen-woodland-89280.herokuapp.com/";

function toTimeZone(time, zone) {
  var format = 'YYYY/MM/DD HH:mm:ss ZZ';
  return moment(time, format).tz(zone).format(format);
}
tz = moment.tz.guess();
// console.log(tz);
var getLatestNews = async function() {
  var url = 'https://api.currentsapi.services/v1/latest-news?' +
    'language=en&' +
    'apiKey=RRSR82k62bGgfUgpVNMb2RXdlGpnfnIpgBS-r7ZKQFsF98vM';
  console.log(url);
  let response = await fetch(url);
  if (response.ok) {
    var json = await response.json();
    console.log(json);
    allNews = json['news'];
    for (var key in allNews) {
      var news = allNews[key];
      var id = news['id'];
      var title = news['title'];
      var description = news['description'];
      var categories = news['category'];
      var language = news['language'];
      var published = news['published'];
      published = toTimeZone(published, tz);
      // console.log(published);
      var nurl = news['url'];
      var author = news['author'];
      var image;
      if (news['image'] != 'None')
        image = news['image'];
      else image = "https://ansionnachfionn.files.wordpress.com/2018/04/donald-trump-president-of-the-united-states-of-america.jpg";
      category_str = "<p>";
      for (var cat in categories) {
        category_str += `<a class="post-category cat-1" href="#">${categories[cat]}</a>`;
      }
      category_str += "</p>";
      post_html_str = `    <div class="col-lg-4">
        						<div class="post">
        							<a class="post-img" href="${nurl}"><img src="${image}" class="rounded" alt="image"></a>
        							<div class="post-body p-3">
        								<div class="post-meta">
        									${category_str}
        									<span class="post-date">${published}</span>
        								</div>
                        <a href="${nurl}" type="button">
        								<h3 class="post-title"><strong>${title}</strong></h3>
                        <p class="mt-1">${description}</p>
                         </a>
        							</div>
        						</div>
        					</div>`
      post_html = $.parseHTML(post_html_str);
      $('#topstories').append(post_html);
    }
    // $("[data-link]").click(function() {
    //   window.location.href = $(this).attr("data-link");
    //   return false;
    // });
  } else {
    console.log("HTTP-Error: " + response.status);
  }
}
getLatestNews();
var getCategories = async function() {
  var url = 'https://api.currentsapi.services/v1/available/categories';
  var res = await fetch(url);
  if (res.ok) {
    json = await res.json();
    categories = json['categories'];
    console.log(json);
    for (var i in categories) {
      var cat = `<li>${categories[i]}</li>`;
      $('#cats-list').append(cat);
      console.log(cat);
    }

  } else {
    console.log("Error:" + res.status);
  }
}

getCategories();


$(document).ready(function() {
  $("#sidebar").mCustomScrollbar({
    theme: "minimal"
  });

  $('#dismiss, .overlay').on('click', function() {
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  });

  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').addClass('active');
    $('.overlay').addClass('active');
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
  });
});
