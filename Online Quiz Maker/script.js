
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

let currentQuiz = null;
let currentQuestion = 0;
let userAnswers = [];
let score = 0;

let questionCount = 0;


// Some sample quizzes for the first time
if (quizzes.length === 0) {
    quizzes = [
        {
            id: 1,
            title: "Basic Computer Quiz",
            description: "Test your basic computer knowledge.",
            questions: [
                {
                    question: "What does CPU stand for?",
                    options: [
                        "Central Processing Unit",
                        "Computer Personal Unit",
                        "Central Program Utility",
                        "Control Processing User"
                    ],
                    correct: 0
                },
                {
                    question: "Which language is used to style web pages?",
                    options: [
                        "HTML",
                        "Python",
                        "CSS",
                        "Java"
                    ],
                    correct: 2
                },
                {
                    question: "What does HTML stand for?",
                    options: [
                        "Hyper Text Markup Language",
                        "High Text Machine Language",
                        "Hyperlink Text Management Language",
                        "Home Tool Markup Language"
                    ],
                    correct: 0
                }
            ]
        }
    ];

    localStorage.setItem("quizzes", JSON.stringify(quizzes));
}


// Page Navigation

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active");
    }

    if (pageName === "quizzes") {
        displayQuizzes();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Create Question

function addQuestion() {

    questionCount++;

    const container = document.getElementById("questionContainer");

    const questionCard = document.createElement("div");

    questionCard.className = "question-card";

    questionCard.id = "question-" + questionCount;

    questionCard.innerHTML = `
        <h3>Question ${questionCount}</h3>

        <input
            type="text"
            class="question-input"
            placeholder="Enter your question"
            required
        >

        <input
            type="text"
            class="option-input"
            placeholder="Option A"
            required
        >

        <input
            type="text"
            class="option-input"
            placeholder="Option B"
            required
        >

        <input
            type="text"
            class="option-input"
            placeholder="Option C"
            required
        >

        <input
            type="text"
            class="option-input"
            placeholder="Option D"
            required
        >

        <label>Correct Answer</label>

        <select class="correct-answer">
            <option value="0">Option A</option>
            <option value="1">Option B</option>
            <option value="2">Option C</option>
            <option value="3">Option D</option>
        </select>

        <button
            type="button"
            class="remove-question"
            onclick="removeQuestion(${questionCount})">
            Remove Question
        </button>
    `;

    container.appendChild(questionCard);
}


// Remove Question

function removeQuestion(id) {

    const question = document.getElementById("question-" + id);

    if (question) {
        question.remove();
    }
}


// Save New Quiz

document.getElementById("quizForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const title = document.getElementById("quizTitle").value.trim();

    const description = document
        .getElementById("quizDescription")
        .value.trim();

    const questionCards = document.querySelectorAll(".question-card");

    if (questionCards.length === 0) {
        alert("Please add at least one question.");
        return;
    }

    const questions = [];

    questionCards.forEach(card => {

        const questionText = card
            .querySelector(".question-input")
            .value.trim();

        const optionInputs = card.querySelectorAll(".option-input");

        const options = [];

        optionInputs.forEach(input => {
            options.push(input.value.trim());
        });

        const correct = Number(
            card.querySelector(".correct-answer").value
        );

        questions.push({
            question: questionText,
            options: options,
            correct: correct
        });
    });

    const newQuiz = {
        id: Date.now(),
        title: title,
        description: description,
        questions: questions
    };

    quizzes.push(newQuiz);

    localStorage.setItem("quizzes", JSON.stringify(quizzes));

    alert("Quiz created successfully!");

    document.getElementById("quizForm").reset();

    document.getElementById("questionContainer").innerHTML = "";

    questionCount = 0;

    showPage("quizzes");

});


// Display Quiz List

function displayQuizzes() {

    const list = document.getElementById("quizList");

    list.innerHTML = "";

    if (quizzes.length === 0) {

        list.innerHTML = `
            <p>No quizzes available yet. Create one!</p>
        `;

        return;
    }

    quizzes.forEach(quiz => {

        const card = document.createElement("div");

        card.className = "quiz-card";

        card.innerHTML = `
            <h3>${escapeHTML(quiz.title)}</h3>

            <p>${escapeHTML(quiz.description)}</p>

            <div class="quiz-info">
                ${quiz.questions.length} Questions
            </div>

            <button onclick="startQuiz(${quiz.id})">
                Start Quiz →
            </button>
        `;

        list.appendChild(card);
    });
}


// Start Quiz

function startQuiz(quizId) {

    currentQuiz = quizzes.find(quiz => quiz.id === quizId);

    if (!currentQuiz) {
        alert("Quiz not found.");
        return;
    }

    currentQuestion = 0;

    userAnswers = [];

    score = 0;

    showPage("takeQuiz");

    loadQuestion();
}


// Load Question

function loadQuestion() {

    const question = currentQuiz.questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        "Question " + (currentQuestion + 1);

    document.getElementById("quizProgress").textContent =
        (currentQuestion + 1) + " / " + currentQuiz.questions.length;

    const progress = ((currentQuestion + 1) /
        currentQuiz.questions.length) * 100;

    document.getElementById("progressFill").style.width =
        progress + "%";

    document.getElementById("questionText").textContent =
        question.question;

    const optionsContainer = document.getElementById("answerOptions");

    optionsContainer.innerHTML = "";

    document.getElementById("answerFeedback").textContent = "";

    document.getElementById("nextBtn").style.display = "none";

    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "option";

        button.textContent = option;

        button.onclick = function() {
            selectAnswer(index);
        };

        optionsContainer.appendChild(button);
    });
}


// Select Answer

function selectAnswer(selectedIndex) {

    const question = currentQuiz.questions[currentQuestion];

    const options = document.querySelectorAll(".option");

    options.forEach(button => {
        button.disabled = true;
    });

    userAnswers[currentQuestion] = selectedIndex;

    const feedback = document.getElementById("answerFeedback");

    if (selectedIndex === question.correct) {

        score++;

        options[selectedIndex].classList.add("correct");

        feedback.textContent = "✓ Correct answer!";

        feedback.style.color = "#16803c";

    } else {

        options[selectedIndex].classList.add("wrong");

        options[question.correct].classList.add("correct");

        feedback.textContent =
            "✗ Wrong answer. The correct answer is: " +
            question.options[question.correct];

        feedback.style.color = "#c62828";
    }

    const nextButton = document.getElementById("nextBtn");

    nextButton.style.display = "inline-block";

    if (currentQuestion === currentQuiz.questions.length - 1) {
        nextButton.textContent = "View Results →";
    } else {
        nextButton.textContent = "Next Question →";
    }
}


// Next Question

function nextQuestion() {

    currentQuestion++;

    if (currentQuestion >= currentQuiz.questions.length) {
        showResults();
        return;
    }

    loadQuestion();
}


// Show Results

function showResults() {

    showPage("results");

    const total = currentQuiz.questions.length;

    document.getElementById("finalScore").textContent =
        score + " / " + total;

    const percentage = Math.round((score / total) * 100);

    let message = "";

    if (percentage === 100) {
        message = "Perfect score! Excellent work.";
    } else if (percentage >= 70) {
        message = "Great job! You know your stuff.";
    } else if (percentage >= 40) {
        message = "Good effort. Keep practicing.";
    } else {
        message = "Keep learning and try again.";
    }

    document.getElementById("resultMessage").textContent = message;

    const answersContainer = document.getElementById("correctAnswers");

    answersContainer.innerHTML = "<h3>Correct Answers</h3>";

    currentQuiz.questions.forEach((question, index) => {

        const answer = document.createElement("div");

        answer.textContent =
            (index + 1) + ". " +
            question.question +
            " — " +
            question.options[question.correct];

        answersContainer.appendChild(answer);
    });
}


// Simple HTML escaping for quiz titles/descriptions

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Registration

document.getElementById("registerForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();

    const email = document.getElementById("registerEmail").value.trim();

    const password = document.getElementById("registerPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const alreadyExists = users.find(user => user.email === email);

    if (alreadyExists) {

        document.getElementById("registerMessage").textContent =
            "This email is already registered.";

        return;
    }

    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("registerMessage").textContent =
        "Registration successful! You can now login.";

    document.getElementById("registerForm").reset();

});


// Login

document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user =>
        user.email === email && user.password === password
    );

    const message = document.getElementById("loginMessage");

    if (user) {

        localStorage.setItem("loggedInUser", JSON.stringify(user));

        message.textContent = "Login successful! Welcome " + user.name;

        document.getElementById("loginForm").reset();

    } else {

        message.textContent = "Invalid email or password.";

    }
});


// Load some questions when the page opens

addQuestion();
addQuestion();