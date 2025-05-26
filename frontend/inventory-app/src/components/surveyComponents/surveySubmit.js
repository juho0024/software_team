import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export function SurveySubmit() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <Card style={{ margin: 'auto', width: '40%', marginTop: 20 }}>
            <Card.Header>설문 제출이 완료되었습니다.</Card.Header>
            <Card.Body>
                <Card.Text>
                    다른 응답을 제출하고 싶다면, 아래 버튼을 클릭하세요.
                </Card.Text>
                <Button variant="outline-info" onClick={() => navigate(`/display-survey/${id}`)}>
                    다른 응답 제출하기
                </Button>
            </Card.Body>
        </Card>
    );
}
