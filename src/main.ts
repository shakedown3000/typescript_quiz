import "./assets/style.css";
import { Quiz } from "./contracts/quiz";

const questionElement = document.querySelector(".question") as HTMLDivElement;
// Button verschwindet nach dem Start
const answerButton = document.querySelector(
  ".answer_button"
) as HTMLButtonElement;
const answerElement = document.getElementById("answer") as HTMLDivElement;
const answerSelection = document.querySelector(
  ".answer_selection"
) as HTMLDivElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;
const nextQuestionDiv = document.getElementById(
  "nextQuestionDiv"
) as HTMLDivElement;

// Englisch einfach
const BASEURL =
  "https://vz-wd-24-01.github.io/typescript-quiz/questions/easy.json";

document.addEventListener("DOMContentLoaded", () => {
  fetchQuizzes();
  if (startButton) {
    startButton.style.display = "block";
    startButton.addEventListener("click", () => {
      if (quizzes.length > 0) {
        startButton.style.display = "none";
        showQuestion();
      } else {
        console.error("Quiz-Daten sind noch nicht geladen.");
      }
    });
  }
});

let quizzes: Quiz[] = [];

// Funktion zum Fetchen der Daten
function fetchQuizzes() {
  fetch(BASEURL)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(
          `Fehler beim Abrufen der Daten: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data: Quiz[]) => {
      quizzes = data;
      console.log("Quiz-Daten erfolgreich geladen:", quizzes);
    })
    .catch((error: Error) => {
      console.error("Fehler beim Abrufen der Quiz-Daten:", error);
    });
}

const scoreArray: number[] = [];
let currentQuizIndex = 0;

function showQuestion() {
  if (quizzes.length === 0) {
    console.error("Keine Quizdaten verfügbar");
    return;
  }
  // Score muss noch woanders platziert werden
  const score = document.createElement("div");
  score.innerHTML = `Your score: ${scoreArray.length.toString()}`;
  if (questionElement && answerSelection && quizzes.length > 0) {
    // Frage
    questionElement.textContent = "";
    const currentQuestion = quizzes[currentQuizIndex]; // Index fängt bei 0 an also erste Frage
    questionElement.textContent = currentQuestion.question;
    console.log(currentQuestion.question);
    answerElement.textContent = "";
    answerSelection.textContent = "";
    currentQuestion.answers.forEach((answer: string, index: number) => {
      const newButton = document.createElement("button");
      newButton.classList.add("answerSelectionButton");
      const buttonValue = (newButton.value = `${index}`);
      newButton.textContent = `${index + 1}. ${answer}`;
      newButton.addEventListener("click", () => {
        // Ergebnis wird an Answerfunktion übergeben
        showAnswer(buttonValue);
        console.log(`Correct answer: ${currentQuestion.correct}`);
        return buttonValue;
      });
      answerSelection.appendChild(newButton);
      answerElement.appendChild(score);
    });
  }
}

const nextQuestionButton = document.createElement("button");

function showAnswer(buttonValue: string): void {
  nextQuestionButton.innerHTML = "Next Question";
  nextQuestionButton.onclick = () => {
    nextQuestion();
    console.log("NextQuestion Button clicked");
  };
  nextQuestionButton.id = "startButton";
  if (quizzes.length > 0) {
    const quiz = quizzes[currentQuizIndex];
    if (buttonValue) {
      const answerButtons = answerSelection.querySelectorAll(
        ".answerSelectionButton"
      );
      answerButtons.forEach((button, index) => {
        const buttonNumber = Number(buttonValue);
        if (index === quiz.correct) {
          button.classList.add("correct");
          if (buttonNumber === quiz.correct) {
            console.log("Your answer is correct!");
            answerElement.textContent = `Your answer is correct! 🏆`;
            scoreArray.push(1);
            if (nextQuestionDiv) {
              nextQuestionDiv.appendChild(nextQuestionButton);
            }
          } else {
            console.log("Your answer is wrong");
            answerElement.textContent = `Your answer is wrong. The correct answer is "${
              index + 1
            }. ${quiz.answers[quiz.correct]}"`;
            if (nextQuestionDiv) {
              answerElement.appendChild(nextQuestionButton);
            }
          }
        } else {
          button.classList.add("incorrect");
        }
      });
    }
  }
}

function nextQuestion() {
  currentQuizIndex++;
  if (currentQuizIndex < quizzes.length) {
    showQuestion();
    nextQuestionButton.remove();
  } else {
    alert("Quiz completed!");
    nextQuestionButton.remove();
  }
}
