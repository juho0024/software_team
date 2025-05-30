이 프로젝트는 가천대학교 팀플 설문 플랫폼인 GachonPick입니다. 프론트엔드와 백엔드가 함께 포함되어 있으며, 학교 이메일 인증을 통해 회원가입이 가능합니다. 먼저 GitHub에서 해당 저장소를 클론하고 testbranch 브랜치로 이동합니다. 이후 backend 폴더로 들어가 .envshared 파일의 이름을 .env로 변경한 후, npm install을 실행하고 npm run dev로 서버를 실행합니다. 마찬가지로 frontend/inventory-app 폴더로 이동해 .envshared를 .env로 이름 변경하고, npm install, npm start 순서로 실행합니다. 회원가입 시에는 가천대 이메일로 인증코드를 받아 입력한 뒤 이름과 비밀번호를 입력하여 회원가입을 완료합니다. 인증코드 확인 후 로그인되지 않고 이름+비밀번호 입력창으로 넘어가면 정상입니다.




만약 npm install 중 오류가 발생하면 npm install --legacy-peer-deps로 설치를 시도하세요. .env 파일이 없다고 나오면 .envshared를 .env로 바꾸는 걸 잊지 않았는지 확인하세요.

로컬에서 반드시 이름을 .env로 변경해야 정상 작동합니다.

기본적으로 그냥 .env로 하면 깃에서 공유를 막는거 같아서 그냥 이름바꿔서 올려버립니다. .env로 두개다 바꿔서 실행하셔야 해요.
그리고 몽고DB 도 포트는 지금 localhost:27017 로 되있습니다. 이건 각자 맞추셔야해요
