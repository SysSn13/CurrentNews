// var proxyUrl = "https://frozen-woodland-89280.herokuapp.com/";

function toTimeZone(time, zone) {
  var format = 'YYYY/MM/DD HH:mm:ss ZZ';
  return moment(time, format).tz(zone).format(format);
}
tz = moment.tz.guess();
// console.log(tz);

var apiTokens = ['RouNhR0LOjaM_dmH-ERyWrsBGcoi4e8ym8Ou-AIxAI-6ZEJK', '-FpkFe-fX2PtaKfHmiv3cMbeAenJkXQ4xm87ji2Aw6dqmzUl', 'i4SQAt180GMqV99ThBklMFOKvcEe-CS4HrKyPv7QTq2WjPvS'];
var apiUsers = ['kuku', 'kuku1', 'kuku2'];

function getKeyIndex() {
  return Math.floor(Math.random() * apiTokens.length);
}

class LatestNews {
  constructor(categories) {
    var category_str = "";
    for (var i = 0; i < categories.length; i++) {
      category_str += categories[i] + ",";
    }
    if(category_str.length)
    category_str = category_str.slice(0,-1);
    console.log(category_str);
    this.url = `https://api.currentsapi.services/v1/latest-news?category=${category_str}&` +
      'language=en&' +
      `apiKey=`;
  }
}

class SearchNews {
  constructor(keyword) {
    this.url = `https://api.currentsapi.services/v1/search?keywords=${keyword}&apiKey=`;
  }
}

class GetNews {
  constructor(url, type) {
    this._url = url;
    this._key_index = getKeyIndex();
    this._max_try = 0;
    this._type = type;
    $('#loading').prop('hidden', false);
    $('#newsdiv').prop('hidden', true);
  }

  async get_data() {
    var url = this._url + apiTokens[this._key_index];
    console.log(url);
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPromise = fetch(url, {
      signal
    });
    var done = false;
    if (this._type == 'search') {
      const timeoutId = setTimeout(function() {
        controller.abort();
        if (!done) {
          $('#newsdiv').html('<h5 class="text-center">No result found </h5>');
          setTimeout(function() {
            $('#loading').prop('hidden', true);
            $('#newsdiv').prop('hidden', false);
          }, 200);
        }
      }, 5000);
    }
    fetchPromise.then(async response => {
      done = true;
      if (response.ok) {
        var json = await response.json();
        console.log(json);
        var allNews = json['news'];
        $('#newsdiv').html('');
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
          var img_str;
          if (news['image'] != 'None')
          img_str =`<a class="post-img" href="${nurl}" target="_blank"><img src="${news['image']}" class="rounded" alt="image"></a>`;
          else img_str='';
          var category_str = "<p>";
          for (var cat in categories) {
            category_str += `<a class="post-category cat-1" href="#">${categories[cat]}</a>`;
          }
          category_str += "</p>";
          var post_html_str = `    <div class="col-lg-4 mt-3 mb-3">
                      <div class="post">
                        ${img_str}
                        <div class="post-body p-3">
                          <div class="post-meta">
                            ${category_str}
                            <span class="post-date">${published}</span>
                          </div>
                          <a href="${nurl}" type="button" target="_blank">
                          <h3 class="post-title"><strong>${title}</strong></h3>
                          <p class="mt-1">${description}</p>
                           </a>
                        </div>
                      </div>
                    </div>`
          var post_html = $.parseHTML(post_html_str);

          $('#newsdiv').append(post_html);
          // break;
        }
        setTimeout(function() {
          $('#loading').prop('hidden', true);
          $('#newsdiv').prop('hidden', false);
        }, 200);

      } else {
        console.log("HTTP-Error: " + response.status);
        if (this._max_try <= apiTokens.length) {
          this._key_index = (this._key_index + 1) % apiTokens.length;
          this._max_try++;
          console.log(this._max_try);
          this.get_data();
        } else {
          console.log("connection error!");
        }
      }
    })
  };
}

$(document).ready(async function() {
  var latestNews = new LatestNews([]);
  var getLatestNews = new GetNews(latestNews.url, 'latest');
  getLatestNews.get_data();
  $('#searchButton').click(function() {
    var val = $('#searchKeyward').val();
    if (val != '') {
      var searchNews = new SearchNews(val);
      var searchResult = new GetNews(searchNews.url, 'search');
      searchResult.get_data();
    }
  });
});

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

var setCategories = async function() {
  var url = 'https://api.currentsapi.services/v1/available/categories';
  var res = await fetch(url);
  if (res.ok) {
    json = await res.json();
    categories = json['categories'];
    // console.log(json);
    for (var i in categories) {
      var cat = `<div class="form-check mb-4">
        <input class="form-check-input" name="category" type="checkbox" id="${categories[i]}" value="${categories[i]}">
        <label class="form-check-label Carter-font" for="${categories[i]}">${capitalize(categories[i])}</label>
      </div>`;
      $('#cats-list').append(cat);
      // console.log(cat);
    }

  } else {
    console.log("Error:" + res.status);
  }
}
setCategories();

function userCategories() {
  var cats = [];
  $('#cats-list input:checked').each(function() {
    cats.push($(this).val());
  });
  return cats;
}

$('#reloadFeedButton').click(function() {
  var cats = userCategories();
  var reloadNewstype = new LatestNews(cats);
  var reloadNews = new GetNews(reloadNewstype.url, 'latest');
  reloadNews.get_data();

});

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
