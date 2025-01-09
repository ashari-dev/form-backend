const answerDuplicate = async (answers) => {
  var seen = new Set();

  const d = answers.some((ans) => {
    if (seen.has(ans.questionId)) {
      return true;
    }
    seen.add(ans.questionId);
  });

  return d;
};

export default answerDuplicate;
