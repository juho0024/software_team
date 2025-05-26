import { useState } from "react";
import { Alert, Button } from "react-bootstrap";

export function AlertDismissible() {
    const [show, setShow] = useState(true);

    return (
        <>
            <Alert show={show} variant="warning">
                <Alert.Heading>❗ 질문 삭제 시 주의하세요</Alert.Heading>
                <p>
                    이 설문에서 질문을 삭제하면 해당 질문에 대한 이전 응답도 함께 삭제됩니다.
                    삭제 후에는 되돌릴 수 없으니 주의하세요.
                </p>
                <p>
                    이전 응답을 유지하고 싶다면 "새 설문"을 생성하는 것을 권장합니다.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setShow(false)} variant="outline-success">
                        이해했어요
                    </Button>
                </div>
            </Alert>

            {!show && (
                <Button onClick={() => setShow(true)} variant="outline-secondary">
                    경고 다시 보기
                </Button>
            )}
        </>
    );
}
