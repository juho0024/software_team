import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import surveyImg from '../images/surveyMakerImg.png';
import surveyResultsImg from '../images/surveyMakerResultsImg.png';

export function Splash() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // ✅ 렌더링 후에만 이동하도록 useEffect 사용
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
      <main className='main' style={{ backgroundColor: 'aliceblue' }}>
        <Container fluid>
          <Row>
            <Col xs={12} md={6} lg={6} style={{ paddingTop: 80, paddingBottom: 50, textAlign: 'right', paddingRight: 40 }}>
              <h2 style={{ fontWeight: 500 }}>고객 인사이트 확보! 매출 향상!</h2><br />
              <h4>설문을 만들어 고객 인사이트를 확보하고 매출로 연결하세요.</h4><br />
              <Button onClick={() => loginWithRedirect()} variant="success" style={{ fontSize: 20 }}>지금 시작하기</Button>
            </Col>
            <Col xs={12} md={6} lg={6} style={{ paddingTop: 40, paddingBottom: 50 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={surveyImg} className="splashImg" alt="설문 예시" />
              </div>
            </Col>
          </Row>

          <Row className='splashSection'>
            <Col sm={12} md={12} style={{ paddingTop: 80 }}>
              <h2 style={{ fontWeight: 500, textAlign: 'center' }}>실시간 결과 확인</h2>
            </Col>
          </Row>

          <Row className='splashSection'>
            <Col sm={12} md={12} style={{ paddingBottom: 30, margin: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img style={{ maxWidth: "700px" }} src={surveyResultsImg} className="splashImg" alt="결과 예시" />
              </div>
            </Col>
          </Row>
        </Container>
      </main>
  );
}
