function startCourse(courseName) {
  let courses = JSON.parse(localStorage.getItem("courses") || "[]");
  if (!courses.includes(courseName)) {
    courses.push(courseName);
    localStorage.setItem("courses", JSON.stringify(courses));
    alert(`You started: ${courseName}`);
  } else {
    alert(`You're already enrolled in: ${courseName}`);
  }
}

window.onload = function () {
  const progressList = document.getElementById("progress-list");
  if (progressList) {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    progressList.innerHTML = courses.length
      ? courses.map(course => `<li>${course}</li>`).join('')
      : '<p>No courses started yet.</p>';
  }
};
