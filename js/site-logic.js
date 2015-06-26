var pipesUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_id=e9a2e77dffb3205d035c4e311d77bbe6&_render=json';
var templateUrl = 'Templates/nnewsPostTemplate.html';
var pageMotto = $('#page-motto');
var newsContainer = $('#data-host');

var renderNewsOnPage = function (data) {
    if (data.count == 0) {
        pageMotto.text('Sorry, but server returned no news for now. Try again later.');
    } else {
        $('#jumbo').fadeIn('slow');
        newsContainer.append(composeNews(data));
        pageMotto.text('Top ' + data.count + ' news from "' + data.value.title + '" pipe!');

        newsContainer.delegate(".news-title", "click", this, toggleDescription);
    }
};

var composeNews = function (pipeData) {
    var divsHost = $(document.createElement('div'));
    return $.tmpl("cachedNewsPostTemplate", pipeData.value.items).appendTo(divsHost);
};

var reportError = function () {
    pageMotto.text('Sorry, but server returned an error.');
};

var toggleDescription = function (titleElement) {
    var description = $(titleElement.currentTarget.parentNode).find('.post-details');

    if (description.css('display') == 'none')
        description.fadeIn('slow');
    else
        description.fadeOut('slow');
};

var getData = function(requestUrl){
    return $.get(requestUrl);
};

var getTemplate = function(){
    return getData(templateUrl)
        .then(cacheTemplate, reportError);
};

var loadPipesData = function(){
    return getData(pipesUrl)
        .fail(reportError);
};

var cacheTemplate = function(data){
    $.template("cachedNewsPostTemplate", data)
};

$(getTemplate()
        .then(loadPipesData)
        .then(renderNewsOnPage)
);