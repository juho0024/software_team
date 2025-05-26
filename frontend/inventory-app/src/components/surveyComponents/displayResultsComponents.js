import { Table, Row, Col } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";

// 🔹 서술형 결과: 텍스트 응답 테이블
export function ShortResponseResults({ question, index }) {
    const responses = question.responses.map((response, idx) => (
        <tr key={idx}>
            <td>{idx + 1}) {response.response}</td>
        </tr>
    ));

    return (
        <Row>
            <Col lg={3} sm={12}></Col>
            <Col lg={6} sm={12} className="surveyQs resultsQs" style={{ margin: 10 }}>
                <h4 style={{ textAlign: "center", fontWeight: 500 }}>
                    질문 {index}: {question.question}
                </h4>
                <div style={{ overflowY: "scroll", height: 300 }}>
                    <Table striped bordered hover>
                        <thead><tr><th>응답 내용</th></tr></thead>
                        <tbody>{responses}</tbody>
                    </Table>
                </div>
            </Col>
            <Col lg={3} sm={12}></Col>
        </Row>
    );
}

// 🔹 객관식/참거짓 결과: 원형 그래프
export function MultipleChoiceResults({ question, index }) {
    const [colors] = useState([
        "#86c036", "#92C8E8", "#FA339A", "#207720", "#F6EF00",
        "#876CB4", "#EC8C32", "#40A3C1", "#A637Ea", "#C8F57A"
    ]);

    const data = question.answer_choices.map(choice => ({
        name: choice,
        y: question.responses.filter(r => r.response === choice).length
    }));

    const options = {
        chart: {
            type: "pie",
            plotBackgroundColor: null,
            backgroundColor: "#eaf4f4"
        },
        title: { text: null },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %"
                }
            }
        },
        series: [{
            name: "응답 수",
            colorByPoint: true,
            data
        }]
    };

    return (
        <Row>
            <Col lg={3}></Col>
            <Col lg={6} className="surveyQs resultsQs" style={{ margin: 10 }}>
                <h4 style={{ fontWeight: "bold", textAlign: "center" }}>
                    질문 {index}: {question.question}
                </h4>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Col>
            <Col lg={3}></Col>
        </Row>
    );
}

// 🔹 설문 제목 및 설명 표시
export function SurveyTitle({ survey }) {
    return (
        <>
            <h2 className="text-center">{survey.title}</h2>
            <h4 className="text-center text-muted">{survey.description}</h4>
            <br />
        </>
    );
}
