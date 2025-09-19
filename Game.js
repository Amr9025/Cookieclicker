(function() {
  let score = 0;
  const scoreEl = document.getElementById('score');
  const cookieBtn = document.getElementById('cookieBtn');

  cookieBtn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
  });
})();
