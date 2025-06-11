const questionEl = document.getElementById('question');
const answerBtns = document.querySelectorAll('.answer-btn');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Helper to decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}


async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
  const data = await res.json();
  questions = data.results.map(q => {
    const options = [...q.incorrect_answers];
    const correctIndex = Math.floor(Math.random() * 4);
    options.splice(correctIndex, 0, q.correct_answer);
    return {
      question: decodeHTML(q.question),
      options: options.map(decodeHTML),
      answer: correctIndex
    };
  });
  loadQuestion();
}


function loadQuestion() {
  feedbackEl.textContent = '';
  answerBtns.forEach(btn => btn.disabled = false);
  const current = questions[currentQuestionIndex];
  questionEl.textContent = current.question;
  answerBtns.forEach((btn, i) => {
    btn.textContent = current.options[i];
    btn.classList.remove('correct', 'incorrect', 'hidden');
  });
  nextBtn.classList.remove('hidden');
  resultEl.classList.add('hidden');
}


answerBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const selected = parseInt(e.target.dataset.index);
    const correct = questions[currentQuestionIndex].answer;

    answerBtns.forEach(b => b.disabled = true);

    if (selected === correct) {
      score++;
      e.target.classList.add('correct');
      feedbackEl.textContent = "Correct!";
      feedbackEl.style.color = "green";
    } else {
      e.target.classList.add('incorrect');
      answerBtns[correct].classList.add('correct');
      feedbackEl.textContent = "Wrong!";
      feedbackEl.style.color = "red";
    }
  });
});


nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});


function showResults() {
  questionEl.textContent = "";
  feedbackEl.textContent = "";
  answerBtns.forEach(btn => btn.classList.add('hidden'));
  nextBtn.classList.add('hidden');
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<h3>You scored ${score} out of ${questions.length}!</h3>`;
}


fetchQuestions();
