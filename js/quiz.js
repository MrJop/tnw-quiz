var $ = jQuery.noConflict();

$(document).ready(function(e) {
    SiteManager.init();
});

var SiteManager = {

    //
    myQuizContainer: $('.js-quiz'),
    quizData:null,
    myQuestions:null,
    myNextButtons: null,
    myRadioButtons: null,
    myStartButton: $('.js-start-button'),
    myStartScreen: $('.js-start-screen'),
    nCurrentQuestion:-1,
    aAnswers: [],

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
                    input = `
                        <div class="slider-container">
                            <h3>${q.answers[0].text}</h3>
                                <input type="range" min="0" max="100" value="50" class="sq-slider" step="${steps}" />
                            <h3>${q.answers[q.answers.length-1].text}</h3>
                        </div>
                    `;
                    optionalButton = '<button class="js-next-button">Verder</button>';
                    break;

                case "multiple-choice":
                    var mcName = `mc_${i}`;
                    for(var j=0;j<q.answers.length;j++){
                        var mcID = `mc_${i}_${j}`;
                        input += `
                            <div class="js-radio-button">
                            <input type="radio" id="${mcID}" name="${mcName}" value="${j}">
                            <label for="${mcID}">${q.answers[j].text}</label></div><br>
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
        //
        this.myStartButton.off('click');
        this.myStartScreen.addClass('--hide');
        this.myStartScreen.removeClass('--show');
        //
        this.aAnswers = [];
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
        if(this.nCurrentQuestion < this.quizData.questions.length) {
            $(this.myQuestions[this.nCurrentQuestion]).addClass('--show');
            //
            switch(this.quizData.questions[this.nCurrentQuestion].type){
                case 'slider':
                    break;
                case 'multiple-choice':
                    this.myRadioButtons = $(this.myQuestions[this.nCurrentQuestion]).find('.js-radio-button');
                    this.myRadioButtons.on('click', this.onRadioButtonClicked.bind(this));
                    break;
            }
        }else{
            this.gotoEndScreen();
        }
    },

    gotoEndScreen: function () {
        var results = {};
        for(var i=0;i<this.quizData.personas.length;i++){
            results[this.quizData.personas[i]] = 0;
        }
        //

        for(var i=0;i<this.quizData.questions.length;i++){
            var q = this.quizData.questions[i];
            var score = q.answers[this.aAnswers[i]];
            //
            for(var j=0;j<this.quizData.personas.length;j++){
                var personaID = this.quizData.personas[j];
                results[personaID]+=score[personaID];
            }
        }

        let sortable = [];
        for (var persona in results) {
            sortable.push([persona, results[persona]]);
        }

        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });

        $('.js-end-screen').append(`<ol>`);
        for(var i=0;i<sortable.length;i++){
            $('.js-end-screen').append(`<li><strong>${sortable[i][0]}</strong>: ${sortable[i][1]}</li>`);
        }
        $('.js-end-screen').append(`</ol>`);

        $('.js-end-screen').addClass('--show');
    },

    storeAnswer: function(){
        var q = this.quizData.questions[this.nCurrentQuestion];
        var answer;
        switch(q.type) {
            case "slider":
                var v = $($(this.myQuestions[this.nCurrentQuestion]).find('input')).val();
                var divider =  100 / (q.answers.length - 1);
                answer = v/divider;
                break;

            case "multiple-choice":
                var inputs = $($(this.myQuestions[this.nCurrentQuestion]).find('input'));
                answer = inputs.filter(":checked").val();
                break;
        }
        this.aAnswers.push(answer);
    },

    onNextClicked: function () {
        this.storeAnswer();
        this.gotoNextQuestion();
    },

    onRadioButtonClicked: function () {
        this.myRadioButtons.off('click');
        window.setTimeout(this.onRadioClickDelayDone.bind(this), 40);
    },

    onRadioClickDelayDone: function () {
        this.storeAnswer();
        this.gotoNextQuestion();
    }
};