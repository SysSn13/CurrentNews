console.log("hello");


var loadfn = async function() {
  var url = "https://hacker-news.firebaseio.com/v0/topstories.json";
  let response = await fetch(url);

  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    console.log(json);
    // $('#json-data').html(json);
    var proxyUrl = "https://frozen-woodland-89280.herokuapp.com/";
    for (key in json) {
      var id = json[key];
      itemurl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
      console.log(itemurl);
      let r = await fetch(itemurl);
      if (r.ok) {
        story = await r.json();
        var title = story['title'];
        var by = story['by'];
        var time = story['time'];
        var url = story['url'];
        var html = `<div class="card mb-3 text-center">
          <div class="card-header">
            by ${by}
          </div>
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="${url}" class="btn btn-primary">Go somewhere</a>
          </div>
          <div class="card-footer text-muted">
            ${time}
          </div>
        </div>`
        $('#topstories').append(html);
        console.log(story);
      } else {
        console.log("HTTP-Error: " + response.status);
      }
    }
  } else {
    console.log("HTTP-Error: " + response.status);
  }
}

// loadfn();

var dskd = async function() {
  var url = 'https://api.currentsapi.services/v1/latest-news?' +
    'language=en&' +
    'apiKey=RRSR82k62bGgfUgpVNMb2RXdlGpnfnIpgBS-r7ZKQFsF98vM';
  console.log(url);
  let response = await fetch(url);
  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
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
      category_str+="</p>";
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

  //
  // var req = new Request(url);
  // await fetch(url)
  //   // .then(function(response) {
  //   //   console.log("dsjds");
  //   //   console.log(response.json());
  //   // })
  //   .then(response => response.json())
  //   .then(data => console.log(data));
}
dskd();
// curl https://api.currentsapi.services/v1/latest-news -G -d language=en -d apiKey=RRSR82k62bGgfUgpVNMb2RXdlGpnfnIpgBS-r7ZKQFsF98vM
