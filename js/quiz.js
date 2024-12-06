var $ = jQuery.noConflict();

$(document).ready(function(e) {
    SiteManager.init();
});

var SiteManager = {
    myQuizContainer: $('.js-quiz'),
    quizData:null,
    myQuestions:null,
    myStartButton: $('.js-start-button'),
    myStartScreen: $('.js-start-screen'),
    nCurrentQuestion:-1,

    init: function() {
        $.getJSON( "data/data.json", this.onDataLoaded.bind(this) );
    },
    onDataLoaded: function(e) {
        this.quizData = e;

        for(var i = 0; i < this.quizData.questions.length; i++){
            var q = this.quizData.questions[i];
            var input;

            switch(q.type){
                case "slider":
                    input = '<input type="range" min="0" max="100" value="50" class="sq-slider" step="25" />';
                    break;
            }

            this.myQuizContainer.append(`
            <div class="question js-question">
                <h2>${q.question}</h2>
                ${input}
            </div>
            `);
        }

        this.myQuestions = $('.js-question');

        this.myStartScreen.addClass('--show');
        this.myStartButton.on('click', this.onStartClicked.bind(this));
    },

    onStartClicked: function () {
        this.myStartButton.off('click');
        this.myStartScreen.addClass('--hide');
        this.myStartScreen.removeClass('--show');
        //
        this.gotoNextQuestion();
    },

    gotoNextQuestion: function () {
        if(this.nCurrentQuestion >= 0){
            $(this.myQuestions[this.nCurrentQuestion]).addClass('--hide');
            $(this.myQuestions[this.nCurrentQuestion]).removeClass('--show');
        }
        //
        this.nCurrentQuestion++;
        //
        $(this.myQuestions[this.nCurrentQuestion]).addClass('--show');
    }
};