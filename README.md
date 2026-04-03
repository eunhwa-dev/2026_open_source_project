# -[운영체제 과제정리.txt](https://github.com/user-attachments/files/26452269/default.txt)
(1) job_queue_.empty()
남은 대기 작업 없음

(2) current_job_.name == 0
지금 실행 중인 작업도 없음

3. 둘 다 필요한 이유 (중요)
❌ 만약 이것만 쓰면?
if (job_queue_.empty())

👉 문제:

queue는 비어있어도
이미 꺼내서 실행 중인 job이 있을 수 있음

→ 아직 끝난 거 아님


❌ 이것만 쓰면?
if (current_job_.name == 0)

👉 문제:

현재 실행 중은 없지만
queue에 job 남아있을 수 있음

→ 끝난 거 아님



2) 가져올 job 있는지 확인
!job_queue_.empty()

👉 대기 작업 있어야 함

arrival_time 체크
job_queue_.front().arrival_time <= current_time_

job 가져오기
current_job_ = job_queue_.front();
job_queue_.pop();

👉 FCFS → queue에서 순서대로

5) context switch 시간 반영
current_time_ += switch_time_;

👉 CPU가 작업 바꾸는 시간

✔ 한 줄 요약
CPU 비었고 + 실행 가능한 job 있으면 → 하나 꺼내서 실행 준비


왜 이 조건을 쓰냐?
remain_time == service_time

👉 의미:

아직 한 번도 실행된 적 없음

왜냐하면:

처음 상태:

remain_time = service_time

실행되면:

remain_time 줄어듦

👉 그래서:

remain_time == service_time → 첫 실행 순간
3. 왜 first_run_time이 필요하냐? (핵심)

이건 그냥 기록용이 아니라
👉 스케줄링 성능 평가 지표 계산에 사용됨

대표적으로 계산하는 값
✔ Response Time
Response Time = first_run_time - arrival_time

👉 “얼마나 빨리 CPU를 받았는지”

✔ 예시
Job A:
arrival = 0
first_run = 5

👉 Response Time = 5

🔹 3. completion_time 기록
current_job_.completion_time = current_time_;
✔ 의미
이 작업이 끝난 시각 기록
✔ 왜 필요하냐

👉 나중에 계산:

Turnaround Time = completion_time - arrival_time

