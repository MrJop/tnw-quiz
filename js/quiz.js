var $ = jQuery.noConflict();

$(document).ready(function(e) {
    SiteManager.init();
});

var SiteManager = {
    myQuizContainer: $('.js-quiz'),
    quizData:null,
    myQuestions:null,
    myNextButtons: null,
    myStartButton: $('.js-start-button'),
    myStartScreen: $('.js-start-screen'),
    nCurrentQuestion:-1,
    oScore:{},

    init: function() {
        $.getJSON( "data/data.json", this.onDataLoaded.bind(this) );
    },
    onDataLoaded: function(e) {
        this.quizData = e;

        for(var i = 0; i < this.quizData.questions.length; i++){
            var q = this.quizData.questions[i];
            var input = '';
            var optionalButton = '';

            switch(q.type){
                case "slider":
                    var steps =  100 / (q.answers.length - 1);
                    input = `<input type="range" min="0" max="100" value="50" class="sq-slider" step="${steps}" />`;
                    optionalButton = '<button class="js-next-button">Verder</button>';
                    break;

                case "multiple-choice":
                    var mcName = `mc_${i}`;
                    for(var j=0;j<q.answers.length;j++){
                        var mcID = `mc_${i}_${j}`;
                        input += `
                            <input type="radio" id="${mcID}" name="${mcName}">
                            <label for="${mcID}">${q.answers[j].text}</label><br>
                        `;
                    }
                    break;
            }

            this.myQuizContainer.append(`
            <div class="question js-question">
                <h2>${q.question}</h2>
                ${input}
                ${optionalButton}
            </div>
            `);
        }

        this.myQuestions = $('.js-question');
        this.myNextButtons = $('.js-next-button');

        this.myStartScreen.addClass('--show');
        this.myStartButton.on('click', this.onStartClicked.bind(this));
        //
        this.myNextButtons.on('click', this.onNextClicked.bind(this));
    },

    onStartClicked: function () {
        this.oScore = {
            "spaarder": 0,
            "budgetplanner": 0,
            "geldsmijter": 0,
            "impulsievekoper": 0,
            "investeerder": 0,
            "nonchalant": 0
        };
        //
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
    },

    storeAnswer: function(){
        var q = this.quizData.questions[this.nCurrentQuestion];
        switch(q.type) {
            case "slider":
                var v = $($(this.myQuestions[this.nCurrentQuestion]).find('input')).val();
                var divider =  100 / (q.answers.length - 1);
                console.log(v/divider);

                break;
        }
    },

    onNextClicked: function () {
        this.storeAnswer();
        this.gotoNextQuestion();
    }
};