import { Form } from "react-bootstrap";
import uniqid from "uniqid";
import { useState } from "react";

// 🔹 짧은 응답형
export function ShortResponse({ question, index, onChange, responseId }) {
    return (
        <Form.Group className="mb-3">
            <Form.Label>
                {index + 1}) {question.question}
            </Form.Label>
            <Form.Control
                id={question._id}
                onChange={(e) => onChange(e, responseId, "short response")}
                name="short response"
                value={question.response.response}
                type="text"
                placeholder="답변을 입력하세요"
            />
        </Form.Group>
    );
}

// 🔹 객관식 응답형
export function MultipleChoice({ question, index, onChange, responseId }) {
    const [isChecked, setIsChecked] = useState(
        question.answer_choices.map((answer) => ({
            answer_choice: answer,
            value: false,
        }))
    );

    const onChangeChecked = (e, selectedIndex) => {
        const updated = isChecked.map((item, i) => ({
            ...item,
            value: i === selectedIndex,
        }));
        setIsChecked(updated);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>
                {index + 1}) {question.question}
            </Form.Label>
            {question.answer_choices.map((answer, idx) => (
                <Form.Check
                    key={uniqid()}
                    label={answer}
                    value={answer}
                    name={question._id}
                    type="radio"
                    checked={isChecked[idx].value}
                    onChange={(e) => {
                        onChangeChecked(e, idx);
                        onChange(e, responseId, "multiple choice");
                    }}
                />
            ))}
        </Form.Group>
    );
}

// 🔹 장문 응답형
export function Paragraph({ question, index, onChange, responseId }) {
    return (
        <Form.Group className="mb-3">
            <Form.Label>
                {index + 1}) {question.question}
            </Form.Label>
            <Form.Control
                id={question._id}
                onChange={(e) => onChange(e, responseId, "paragraph")}
                name="paragraph"
                value={question.response.response}
                as="textarea"
                rows={4}
                placeholder="답변을 입력하세요"
            />
        </Form.Group>
    );
}

// 🔹 설문 제목 & 설명
export function SurveyTitle({ survey }) {
    return (
        <>
            <h2 className="text-center">{survey.title}</h2>
            <h5 className="text-center text-muted">{survey.description}</h5>
            <br />
        </>
    );
}
