//CRUD options to update database with inventory items
const asyncHandler = require("express-async-handler");
const Survey = require("../models/surveyModel");
const User = require("../models/userModel");

// get all surveys
//@route GET /surveys
const getSurvey = asyncHandler(async (req, res) => {
  
  const survey = await Survey.findById(req.params.id);
  res.status(200).json(survey);
});

// get surveys by user
//only sending out survey title, id and number of responses
//@route GET /surveys-by-user
const getSurveysByUser = asyncHandler(async (req, res) => {
  //grab survey ids from database
  const user = await User.findById(req.params.id);
  const surveyIds = [...user.surveys];

  if (!user) {
    res.status(400);
    throw new Error("That user was not found.");
  } else if (surveyIds.length === 0) {
    res.status(401).json("No surveys were found");
  }

  //grab surveys from database
  let surveyList = [];
  for (let i = 0; i < surveyIds.length; i++) {
    const survey = await Survey.findById(surveyIds[i]);
    if (!survey) {
      console.log("no survey found");
    } else {
      const necessaryData = {
        title: survey.title,
        responseTotal: survey.questions[0].responses.length,
        _id: survey._id,
      };
      surveyList.push(necessaryData);
    }
  }
  //send surveys over
  res.status(200).json(surveyList);
});

//create new surveys
//@route POST /surveys/create
const createandUpdateSurvey = asyncHandler(async (req, res) => {
  //check if the surveyid is already there
  //if there, the survey must be updated
  //if not there, the survey must be created
  let findSurvey = await Survey.findById(req.body.survey_id);
  console.log('findSurvey= " + findSurvey');
  if(findSurvey) {
    //place questions in an array
    let questions = [...req.body.questions];

    //check if questions exist in body
    //if question exists, add responses and array to question
    questions.map((question) => {
      let index = findSurvey.questions.findIndex(
        (findSurveyQuestion) => findSurveyQuestion._id === question._id
      );
      if (index > -1) {
        question.responses = findSurvey.questions[index].responses;
      }
    });

    //send survey to database for updating
    const updatedSurvey = await Survey.findByIdAndUpdate(
      req.body.survey_id,
      {
        questions: questions,
        title: req.body.title,
        description: req.body.description,
      },
      { new: true }
    );
    res.status(200).json(updatedSurvey);
  } else {
    const survey = await Survey.create({
      questions: req.body.questions,
      user_id: req.body.user_id,
      title: req.body.title,
      description: req.body.description,
      creationTime: req.body.creationTime,
      _id: req.body.survey_id,
    });
    console.log("survey = " + survey);

    let user = await User.findById(req.body.user_id);
    if (user) {
      //push this survey to the user too
      const newSurveys = [...user.surveys];
      newSurveys.push(req.body.survey_id);
      let updatedUser = await User.findOneAndUpdate(
        { _id: req.body.user_id },
        { surveys: newSurveys }
      );
      console.log(updatedUser);
      res.status(200).json(updatedUser);
    } else {
      res
        .status(402)
        .json(
          "This user was not found.  The survey might have been added to the database though."
        );
    }
  }
});

//update surveys
//@route PUT /surveys/update
const updateSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(400);
    throw new Error("That Survey was not found.");
  }
  const updatedSurvey = await Survey.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedSurvey);
});

//update surveys with responses
//@route put
const saveResponsesToSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(400);
    throw new Error("That Survey was not found.");
  }
  //getting questions and the _id from the body
  const { questions, _id } = req.body;
  //new questions comes from database
  let newQuestions = [...survey.questions];

  newQuestions.forEach((originalQuestion) => {
    //find matching index
    let index = questions.findIndex(
      (submittedQuestion) => submittedQuestion._id === originalQuestion._id
    );
    //push responses onto responses array
    originalQuestion.responses.push(questions[index].response);
  });

  const updatedSurvey = await Survey.findByIdAndUpdate(
    survey._id,
    { questions: newQuestions },
    { new: true }
  );
  res.status(200).json(updatedSurvey);
});

//delete surveys
//@route DELETE /surveys/delete
const deleteSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(400);
    throw new Error("That Survey was not found.");
  }
  await Survey.deleteOne({ _id: req.params.id });
  const existState = await Survey.findOne({ _id: req.params.id });
  res.status(200).json({ id: req.params.id, exists: existState });
});

module.exports = {
  getSurvey,
  createandUpdateSurvey,
  updateSurvey,
  deleteSurvey,
  saveResponsesToSurvey,
  getSurveysByUser,
};
