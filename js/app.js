/* global $ */

// State object
const state = {
    questions: [
        {
            text: "Which number am I thinking of?",
            choices: ["1", "2", "3",  "4"],
            correctChoiceIndex: 0,
        },
        {
            text: "What about now, can you guess now?",
            choices: ["1", "2", "3", "4"],
            correctChoiceIndex: 1,
        },
        {
            text: "I'm thinking of a number between 1 and 4. What is it?",
            choices: ["1", "2", "3", "4"],
            correctChoiceIndex: 2,
        },
        {
            text: "If I were a number between 1 and 4, which would I be?",
            choices: ["1", "2", "3", "4"],
            correctChoiceIndex: 3,
        },
        {
            text: "Guess what my favorite number is",
            choices: ["1", "2", "3", "4"],
            correctChoiceIndex: 0,
        }
    ],
    praises : [
        "Wow. You got it right. I bet you feel really good about yourself now",
        "Correct. Which would be impressive, if it wasn't just luck",
        "Oh was I yawning? Because you getting that answer right was boring me to sleep",
        "Hear all that applause for you because you got this question right? Neither do I."
    ],

    admonishments: [
        "Really? That's your guess? WE EXPECTED BETTER OF YOU!",
        "Looks like someone wasn't paying attention in telepathy school, geesh!",
        "That's incorrect. You've dissapointed yourself, your family, your city, state, country and planet, to say nothing of the cosmos"
    ],
    score: 0,
    currentQuestionIndex: 0,
    route: "start",
    lastAnswerCorrect: false,
    feedbackRandom: 0
};

// State modification functions
function setRoute(state, route) {
    state.route = route;
}

function resetGame(state) {
    state.score = 0;
    state.currentQuestionIndex = 0;
    setRoute(state, "start");
}

function answerQuestion(state, answer) {
    const currentQuestion = state.questions[state.currentQuestionIndex]; // added const
    state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
    if (state.lastAnswerCorrect) {
        state.score++;
    }
    selectFeedback(state);
    setRoute(state, "answer-feedback");
}

function selectFeedback(state) {
    state.feedbackRandom = Math.random();
}

function advance(state) {
    state.currentQuestionIndex++;
    if (state.currentQuestionIndex === state.questions.length) {
        setRoute(state, "final-feedback");
    }
    else {
        setRoute(state, "question");
    }
}

// Render functions
function renderApp(state, elements) {
  // default to hiding all routes, then show the current route
    Object.keys(elements).forEach((route) => {     // added big arrow
        elements[route].hide();
    });
    elements[state.route].show();

    if (state.route === "start") {
        renderStartPage(state, elements[state.route]);
    }
    else if (state.route === "question") {
        renderQuestionPage(state, elements[state.route]);
    }
    else if (state.route === "answer-feedback") {
        renderAnswerFeedbackPage(state, elements[state.route]);
    }
    else if (state.route === "final-feedback") {
        renderFinalFeedbackPage(state, elements[state.route]);
    }
}

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system
function renderStartPage() {
}

function renderQuestionPage(state, element) {
    renderQuestionCount(state, element.find(".question-count"));
    renderQuestionText(state, element.find(".question-text"));
    renderChoices(state, element.find(".choices"));
}

function renderAnswerFeedbackPage(state, element) {
    renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
    renderAnswerFeedbackText(state, element.find(".feedback-text"));
    renderNextButtonText(state, element.find(".see-next"));
}

function renderFinalFeedbackPage(state, element) {
    renderFinalFeedbackText(state, element.find(".results-text"));
}

function renderQuestionCount(state, element) {
    const text = `${state.currentQuestionIndex}  1 /  ${state.questions.length}`; // added string literal
    element.text(text);
}

function renderQuestionText(state, element) {
    const currentQuestion = state.questions[state.currentQuestionIndex]; //changed to const
    element.text(currentQuestion.text);
}

function renderChoices(state, element) {
    var currentQuestion = state.questions[state.currentQuestionIndex];
    var choices = currentQuestion.choices.map((choice, index) => {    //added big arrow
        return (
          `<li>
            <input type=radio name=user-answer value= ${index} required>
            <label> ${choice} </label>
          </li>`
        );
    });
    element.html(choices);
}

function renderAnswerFeedbackHeader(state, element) {
    const html = state.lastAnswerCorrect ?  //changed to const
      "<h6 class='user-was-correct'>correct</h6>" :
      "<h1 class='user-was-incorrect'>Wrooonnnngggg!</>";

    element.html(html);
}

function renderAnswerFeedbackText(state, element) {
    const choices = state.lastAnswerCorrect ? state.praises : state.admonishments; //changed to const
    const text = choices[Math.floor(state.feedbackRandom * choices.length)];  //changed to const
    element.text(text);
}

function renderNextButtonText(state, element) {
    const text = state.currentQuestionIndex < state.questions.length - 1 ? //changed to const
      "Next" : "How did I do?";
    element.text(text);
}

function renderFinalFeedbackText(state, element) {
    const text = `You got ${state.score} out of
      ${state.questions.length} questions right.`;  // changed to const, template string
    element.text(text);
}

// Event handlers
const PAGE_ELEMENTS = {
    "start": $(".start-page"),
    "question": $(".question-page"),
    "answer-feedback": $(".answer-feedback-page"),
    "final-feedback": $(".final-feedback-page")
};

$("form[name='game-start']").submit((event) => {  //added big arrow
    event.preventDefault();
    setRoute(state, "question");
    renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click((event) => {  //added big arrow
    event.preventDefault();
    resetGame(state);
    renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit((event) => {  //added big arrow
    event.preventDefault();
    let answer = $("input[name='user-answer']:checked").val();
    answer = parseInt(answer, 10);
    answerQuestion(state, answer);
    renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(() => {  //added big arrow
    advance(state);
    renderApp(state, PAGE_ELEMENTS);
});

$(() => renderApp(state, PAGE_ELEMENTS));  //added arrow, removed brackets
