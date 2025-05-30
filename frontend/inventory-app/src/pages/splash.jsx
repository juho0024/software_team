import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import surveyImg from '../images/surveyMakerImg.png';
import surveyResultsImg from '../images/surveyMakerResultsImg.png';
import { useAuth } from '../hooks/AuthContext'; // ✅ JWT 기반 AuthContext 사용

export function Splash() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');  // 로그인 상태면 대시보드로 이동
    }
  }, [user, navigate]);

  return (
      <main className='main' style={{ backgroundColor: 'aliceblue' }}>
        <Container fluid>
          <Row>
            <Col
                xs={12}
                md={6}
                lg={6}
                style={{
                  paddingTop: 80,
                  paddingBottom: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  paddingLeft: 40,
                  paddingRight: 40,
                }}
            >
              <div style={{ maxWidth: "500px", fontSize: "1.05rem", lineHeight: "1.8" }}>
                <h4 className="fw-bold">가천대학교 설문 플랫폼, Gachon pick !</h4>
                <p>
                  먼저, 회원가입 진행 시, 학교 이메일로 전송된 코드를 인증하세요.<br />
                  가천대 재학생만 이용 가능합니다!
                </p>
                <p>
                  과제, 발표, 졸업 프로젝트 등 설문이 필요한 모든 순간,<br />
                  누구나 손쉽게 설문을 만들고 배포할 수 있습니다.
                </p>
                <p>
                  질문을 직접 구성하고, 참여자를 쉽게 초대하며<br />
                  응답 결과는 자동으로 시각화된 통계로 실시간 확인할 수 있습니다.
                </p>
                <p>
                  또한, 응답자 중 추첨을 통해 카카오톡 ID로 친구 추가 후<br />
                  선물을 보낼 수 있는 기능까지 제공되어 참여율을 높이고<br />
                  프로젝트의 신뢰도도 함께 향상시킬 수 있습니다.
                </p>
                <p className="fw-semibold mt-3">지금 바로 시작해보세요!</p>

                <Button
                    onClick={() => navigate('/login')}
                    variant="success"
                    style={{ fontSize: 20, marginTop: 10 }}
                >
                  지금 시작하기
                </Button>
              </div>
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
                <img
                    style={{ maxWidth: "700px" }}
                    src={surveyResultsImg}
                    className="splashImg"
                    alt="결과 예시"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </main>


  );

}
