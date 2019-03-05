/* gif madness */

$(document).ready(function() {

    var gifMadness = (function(){
        
        let topics = [
            'pizza',
            'steak',
            'pasta',
            'chicken wings',
            'broccoli',
            'apples',
            'frying pan',
            'eggs',
            'coffee',
            'sausage',
            'lollipop',
            'chocolate',
            'nachos',
            'sandwich',
            'gyro',
            'roast beef'
        ];
        //localStorage.setItem('giphyTopics', JSON.stringify(topics));
        let storedTopics = JSON.parse(localStorage.getItem('giphyTopics'));
        if (storedTopics != null) {
            topics = storedTopics;
        }
        let gifButtonsEl = $('.gif-buttons');
        let gifContainerEl =  $('.gif-container');

        let giphyKey = 'N2UEhSvASDO1KWZ51RTpFt61S39PNCvt';
        let getLimit = 9;
        let giphyOffset = 0;
    
        function init(){
            initButtons(topics);
            getGifs(topics[0], getLimit, giphyOffset);
            getNewGifs();
            loadMoreGifs();
        }
        
        function initButtons(topics){
            gifButtonsEl.empty();
            localStorage.setItem('giphyTopics', JSON.stringify(topics));
            topics.map(function(food) {
                let btnEl = $('<button>');
                btnEl.text(food)
                    .appendTo(gifButtonsEl)
                    .on('click', function(e){
                        e.preventDefault();
                        getGifs($(this).text(), getLimit, giphyOffset);
                    });
            });
        }

        function getGifs(topic, limit, offset){
            localStorage.setItem('giphyTopic', topic);
            let giphyApiUrl = 'http://api.giphy.com/v1/gifs/search?q=' + topic + '&api_key=' + giphyKey + '&limit=' + limit + '&offset=' + offset;
            $.ajax({
                'url': giphyApiUrl,
                'method': 'GET'
            }).then(function(response){
                // console.log(response);
                let giphyData = response.data;
                if(!offset){
                    gifContainerEl.empty();
                }
                Object.keys(giphyData).forEach(function(key, index){
                    console.log(giphyData[key]);
                    let divEl = $('<div>').addClass('gif-block');
                    let title = giphyData[key].title.trim() != '' ? giphyData[key].title : 'no title';
                    let titleEl = $('<h4>').text(title);
                    let metaEl = $('<p>').text('Rated: ' + giphyData[key].rating);
                    let source = giphyData[key].source_tld;
                    source = source.length > 22 ? source.substr(0,22) + '...' : giphyData[key].source_tld;
                    metaEl.append('<br><span title="' + giphyData[key].source_tld + '">Source: ' + source + '</span>');
                    let imgEl = $('<img>').attr('data-state', 'still').addClass('gif');
                    imgEl.attr('data-still', giphyData[key].images.fixed_width_still.url);
                    imgEl.attr('data-animate', giphyData[key].images.fixed_width.url);
                    imgEl.attr('src', giphyData[key].images.fixed_width_still.url);
                    imgEl.on('click', animateGif);
                    divEl.append(titleEl).append(metaEl).append(imgEl);
                    gifContainerEl.append(divEl);
                });
            });
        }


        function animateGif(){
            let btn = $(this);
            if (btn.attr('data-state') === 'still') {
                btn.attr('src', btn.attr('data-animate'));
                btn.attr('data-state', 'animated');
            } else {
                btn.attr('src', btn.attr('data-still'));
                btn.attr('data-state', 'still');
            }
        }


        function loadMoreGifs(){
            $('.add-more').on('click', function(e){
                e.preventDefault();
                offset = getLimit + localStorage.getItem('giphyOffset');
                getGifs(localStorage.getItem('giphyTopic'),getLimit,parseInt(offset));
            });
        }

        function getNewGifs(){
            $('#submit-newgif').on('click', function(e){
                e.preventDefault();
                newGifEl = $('#newgif');
                newGif = newGifEl.val().trim();
                if (newGif.length) {
                    if (!topics.includes(newGif)){
                        topics.splice(0, 1, newGif);
                    }
                    newGifEl.val('');
                    getGifs(newGif, getLimit, giphyOffset);
                    initButtons(topics);
                } else {
                    alert('nothing entered');
                }
            })
        }
        init();
    });
    gifMadness();


});
