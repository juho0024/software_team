const asyncHandler = require("express-async-handler");
const Survey = require("../models/surveyModel");
const User = require("../models/userModel");

// 설문 가져오기
const getSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  res.status(200).json(survey);
});

// 사용자별 설문 목록 가져오기
const getSurveysByUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("That user was not found.");
  }

  const surveyIds = [...user.surveys];
  if (surveyIds.length === 0) {
    return res.status(200).json("No surveys were found");
  }

  const surveyList = [];
  for (let i = 0; i < surveyIds.length; i++) {
    const survey = await Survey.findById(surveyIds[i]);
    if (survey) {
      surveyList.push({
        title: survey.title,
        responseTotal: survey.questions[0]?.responses?.length || 0,
        _id: survey._id,
      });
    }
  }

  res.status(200).json(surveyList);
});

// 생성 또는 업데이트
const createandUpdateSurvey = asyncHandler(async (req, res) => {
  const { questions, title, description, user_id, creationTime, survey_id } = req.body;

  let existing = await Survey.findById(survey_id);
  if (existing) {
    const updated = await Survey.findByIdAndUpdate(survey_id, {
      questions,
      title,
      description,
    }, { new: true });
    return res.status(200).json({ success: true, survey: updated });
  } else {
    const newSurvey = await Survey.create({
      questions,
      title,
      description,
      user_id,
      creationTime,
      _id: survey_id,
    });

    const user = await User.findById(user_id);
    if (user) {
      user.surveys.push(survey_id);
      await user.save();
    }

    return res.status(201).json({ success: true, survey: newSurvey });
  }
});

// 응답 저장
const saveResponsesToSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    res.status(404);
    throw new Error("Survey not found");
  }

  const { questions } = req.body;

  const updatedQuestions = await Promise.all(
    survey.questions.map(async original => {
      const incoming = questions.find(q => q._id === original._id);
      if (incoming && incoming.response) {
        const existingResponses = original.responses || [];

        // ✅ user_id → 이름 조회
        const user = await User.findById(incoming.response.user_id);
        const userName = user ? user.name : "익명";

        const newResponse = {
          ...incoming.response,
          name: userName, // ✅ 이름 추가
          time: new Date()
        };

        return {
          ...original.toObject(),
          responses: [...existingResponses, newResponse]
        };
      }
      return original;
    })
  );

  survey.questions = updatedQuestions;
  const saved = await survey.save();

  res.status(200).json({ success: true, survey: saved });
});


const updateSurvey = asyncHandler(async (req, res) => {
  const survey = await Survey.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!survey) {
    res.status(404);
    throw new Error("Survey not found");
  }
  res.status(200).json({ success: true, survey });
});

const deleteSurvey = asyncHandler(async (req, res) => {
  const deleted = await Survey.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error("Survey not found");
  }
  res.status(200).json({ success: true });
});

module.exports = {
  getSurvey,
  getSurveysByUser,
  createandUpdateSurvey,
  updateSurvey,
  deleteSurvey,
  saveResponsesToSurvey
};
