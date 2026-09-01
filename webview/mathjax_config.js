MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  svg: { fontCache: 'global' }
};

function refreshMathDisplays() {
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}