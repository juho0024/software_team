import React, { useState, useEffect } from "react";
import { Form, Button, CloseButton } from "react-bootstrap";
import uniqid from "uniqid";

// 짧은 응답형
export function ShortResponse({ question, index, onChange, deleteQuestion }) {
    return (
        <Form.Group className="mb-3 surveyQs">
            <CloseButton className="closeBtn" onClick={(e) => deleteQuestion(e, question._id)} />
            <h4>
                질문 {index + 1}: <small className="text-muted">주관식 질문</small>
            </h4>
            <Form.Label>질문 내용</Form.Label>
            <Form.Control
                id={question._id}
                answer="no"
                onChange={onChange}
                name="short response"
                value={question.question}
                type="text"
                placeholder="질문을 입력하세요"
            />
        </Form.Group>
    );
}

// 객관식
export function MultipleChoice({ question, index, onChange, addAnswerChoice, deleteQuestion }) {
    const answerChoices = question.answer_choices.map((choice, i) => (
        <div key={i}>
            <Form.Control
                id={question._id}
                name="answerChoice"
                answernum={i}
                answer="yes"
                onChange={onChange}
                value={choice}
                type="text"
                placeholder={`선택지 ${i + 1}`}
            />
            <br />
        </div>
    ));

    return (
        <Form.Group className="mb-3 surveyQs">
            <CloseButton className="closeBtn" onClick={(e) => deleteQuestion(e, question._id)} />
            <h4>
                질문 {index + 1}: <small className="text-muted">객관식 질문</small>
            </h4>
            <Form.Label>질문 내용</Form.Label>
            <Form.Control
                id={question._id}
                answer="no"
                onChange={onChange}
                name="multiple choice"
                value={question.question}
                type="text"
                placeholder="질문을 입력하세요"
            />
            <br />
            <Form.Label>선택지</Form.Label>
            {answerChoices}
            <Button variant="outline-info" onClick={(e) => addAnswerChoice(e, question._id)}>
                선택지 추가
            </Button>
        </Form.Group>
    );
}

// OX형
export function TrueFalse({ question, index, onChange, deleteQuestion }) {
    const answerChoices = question.answer_choices.map((choice, i) => (
        <div key={i}>
            <Form.Control
                id={question._id}
                answernum={i}
                answer="yes"
                onChange={onChange}
                name="answerChoice"
                value={choice}
                type="text"
                placeholder={`선택지 ${i + 1}`}
            />
            <br />
        </div>
    ));

    return (
        <Form.Group className="mb-3 surveyQs">
            <CloseButton className="closeBtn" onClick={(e) => deleteQuestion(e, question._id)} />
            <h4>
                질문 {index + 1}: <small className="text-muted">O/X 질문</small>
            </h4>
            <Form.Label>질문 내용</Form.Label>
            <Form.Control
                id={question._id}
                answer="no"
                onChange={onChange}
                name="true/false"
                value={question.question}
                type="text"
                placeholder="질문을 입력하세요"
            />
            <br />
            <Form.Label>선택지</Form.Label>
            {answerChoices}
        </Form.Group>
    );
}

// 긴 응답형
export function Paragraph({ question, index, onChange, deleteQuestion }) {
    return (
        <Form.Group className="mb-3 surveyQs">
            <CloseButton className="closeBtn" onClick={(e) => deleteQuestion(e, question._id)} />
            <h4>
                질문 {index + 1}: <small className="text-muted">장문형 질문</small>
            </h4>
            <Form.Label>질문 내용</Form.Label>
            <Form.Control
                id={question._id}
                answer="no"
                onChange={onChange}
                name="paragraph"
                value={question.question}
                type="text"
                placeholder="질문을 입력하세요"
            />
        </Form.Group>
    );
}

// 설문 제목 + 설명 입력란
export function SurveyTitle({ survey, onChange }) {
    return (
        <Form.Group className="mb-3 surveyQs">
            <h4>📋 설문 기본 정보</h4>
            <Form.Label>설문 제목</Form.Label>
            <Form.Control
                id={survey._id}
                onChange={onChange}
                name="title"
                value={survey.title}
                type="text"
                placeholder="설문 제목을 입력하세요"
            />
            <br />
            <Form.Label>설문 설명</Form.Label>
            <Form.Control
                id={survey._id}
                onChange={onChange}
                name="description"
                value={survey.description}
                type="text"
                placeholder="설문 목적이나 안내사항을 입력하세요"
            />
        </Form.Group>
    );
}
