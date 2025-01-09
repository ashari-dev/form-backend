const questionRequired = async (form, answers) => {
  const found = form.question.filter((ques) => {
    if (ques.required == true) {
      const answer = answers.find((ans) => ans.questionId == ques.id);
      if (
        answer.value === undefined ||
        answer.value === undefined ||
        answer.value === ""
      ) {
        return true;
      }
    }
  });

  return found.length > 0 ? true : false;
};

export default questionRequired;
