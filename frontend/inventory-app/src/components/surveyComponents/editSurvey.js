// EditSurvey.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Form } from 'react-bootstrap';
import uniqid from 'uniqid';
import {
    MultipleChoice,
    Paragraph,
    ShortResponse,
    TrueFalse,
    SurveyTitle
} from './createQuestionComponents';

export function EditSurvey(props) {
    const { getAccessTokenSilently } = useAuth0();
    const [survey, setSurvey] = useState({
        _id: '',
        title: '',
        description: '',
        user_id: props.id,
        questions: []
    });
    const [questions, setQuestions] = useState([]);
    const [showAddQuestionBtn, setShowAddQuestionBtn] = useState(true);

    const handleSurveyChange = (e) => {
        setSurvey({ ...survey, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (e) => {
        const questionArray = [...questions];
        const index = questionArray.findIndex(q => q._id === e.target.id);

        if (e.target.getAttribute('answer') === 'yes') {
            const answerChoices = [...questionArray[index].answer_choices];
            answerChoices[e.target.getAttribute('answernum')] = e.target.value;
            questionArray[index].answer_choices = answerChoices;
        } else {
            questionArray[index].question = e.target.value;
        }
        setQuestions(questionArray);
    };

    const addMoreAnswerChoices = (e, id) => {
        const questionArray = [...questions];
        const index = questionArray.findIndex(q => q._id === id);
        questionArray[index].answer_choices.push('');
        setQuestions(questionArray);
    };

    const addQuestion = (e) => {
        const questionArray = [...questions];
        const type = e.target.value;
        const newQuestion = {
            _id: uniqid('question-'),
            question: '',
            responses: []
        };

        switch (type) {
            case '1':
                newQuestion.type = 'short response';
                newQuestion.answer_choices = [];
                break;
            case '2':
                newQuestion.type = 'multiple choice';
                newQuestion.answer_choices = ['', ''];
                break;
            case '3':
                newQuestion.type = 'true/false';
                newQuestion.answer_choices = ['True', 'False'];
                break;
            case '4':
                newQuestion.type = 'paragraph';
                newQuestion.answer_choices = [];
                break;
            default:
                return;
        }

        questionArray.push(newQuestion);
        setQuestions(questionArray);
    };

    const deleteQuestion = (e, id) => {
        const questionArray = [...questions].filter(q => q._id !== id);
        setQuestions(questionArray);
    };

    const callApi = useCallback(async (url, fetchOptions) => {
        const serverUrl = 'http://localhost:5000';
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${serverUrl}${url}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                ...fetchOptions
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }, [getAccessTokenSilently]);

    const onSubmitSurvey = async (e) => {
        e.preventDefault();

        await callApi('/api/surveys/create', {
            method: 'POST',
            body: JSON.stringify({
                ...survey,
                questions,
                creationTime: new Date()
            })
        });

        await callApi(`/users/updateSurveys/${survey.user_id}`, {
            method: 'PUT',
            body: JSON.stringify({ survey_id: survey._id })
        });

        props.switchView('displaySurvey');
        props.sendSurveyId(survey._id);
    };

    const renderForm = () => {
        const questionForms = questions.map((q, i) => {
            const commonProps = {
                key: q._id,
                question: q,
                onChange: handleQuestionChange,
                deleteQuestion,
                index: i
            };
            switch (q.type) {
                case 'short response': return <ShortResponse {...commonProps} />;
                case 'multiple choice': return <MultipleChoice {...commonProps} addAnswerChoice={addMoreAnswerChoices} />;
                case 'true/false': return <TrueFalse {...commonProps} addAnswerChoice={addMoreAnswerChoices} />;
                case 'paragraph': return <Paragraph {...commonProps} />;
                default: return null;
            }
        });

        return (
            <div style={{ maxWidth: '50%', margin: 'auto', paddingTop: 20 }}>
                <SurveyTitle onChange={handleSurveyChange} survey={survey} />
                {questionForms}
                {showAddQuestionBtn ? (
                    <div>
                        {questions.length > 0 && <Button style={{ margin: 10 }} variant="success" onClick={() => setShowAddQuestionBtn(false)}>Add Question</Button>}
                        {questions.length > 0 && <Button variant="info" onClick={onSubmitSurvey}>Save and Finish Survey</Button>}
                        {questions.length === 0 && <Button variant="info" onClick={() => setShowAddQuestionBtn(false)}>Add Question</Button>}
                    </div>
                ) : (
                    <>
                        <h4>Choose a Question Type</h4>
                        <Form.Select aria-label="Select Question Type" onChange={addQuestion}>
                            <option></option>
                            <option value="1">Short Response</option>
                            <option value="2">Multiple Choice</option>
                            <option value="3">True/False</option>
                            <option value="4">Paragraph Response</option>
                        </Form.Select>
                    </>
                )}
            </div>
        );
    };

    return <main className="main">{renderForm()}</main>;
}