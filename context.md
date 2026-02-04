# Project Context
# 이 문서는 프로젝트 전반에 적용되는 컨텍스트와 절대 규칙을 정의한다.

Rules in "Human Notes" must never override or reinterpret Absolute Rules.

This project is a production Google Apps Script system.
# 이 프로젝트는 테스트용이 아닌 실제 운영 중인 Google Apps Script 시스템이다.

Assume real users, concurrent executions, and strict data integrity.
# 실제 사용자 존재, 동시 실행 가능성, 데이터 무결성을 전제로 모든 코드를 작성해야 한다.

Do NOT introduce speculative logic.
# 근거 없는 추측성 로직이나 “아마 이럴 것이다”라는 가정 기반 구현을 금지한다.

## Absolute Rules
# 절대 규칙 섹션으로, 다른 모든 문서나 설명보다 우선한다.

- Do NOT access Google Sheets directly outside repository modules.
  # Repository 모듈 외부에서 SpreadsheetApp을 직접 사용하는 것을 금지한다.

- Do NOT create or modify global mutable state.
  # 전역 가변 상태를 생성하거나 수정하는 것을 금지한다.
  # 실행 간 상태 공유로 인한 데이터 꼬임을 방지하기 위함이다.

- Do NOT introduce new triggers without explicit request.
  # 명시적인 요청 없이 onEdit, 시간 기반 트리거 등을 추가하지 않는다.
  # 의도치 않은 중복 실행 및 자동 실행 사고를 방지하기 위함이다.

## Module Responsibilities
# 각 파일이 담당해야 할 역할과 책임을 명확히 정의한다.

- config.gs
  # 설정 관련 전용 모듈

  - Read-only access to configuration values
    # 설정 값은 읽기 전용으로만 접근해야 한다.

  - No side effects
    # 상태 변경, I/O, 실행 흐름 변경 등의 부작용을 일으키면 안 된다.

- utils.gs
  # 공통 유틸리티 모듈

  - All LockService usage must be encapsulated here
    # LockService 사용은 반드시 이 파일 안에서만 이루어져야 한다.

  - No business logic
    # 비즈니스 규칙이나 판단 로직을 포함해서는 안 된다.

- memberRepo.gs
  # 시트 접근을 전담하는 Repository 모듈

  - All SpreadsheetApp access lives here
    # 모든 SpreadsheetApp 접근 코드는 이 파일에만 존재해야 한다.

  - No validation or business rules
    # 데이터 검증이나 비즈니스 판단 로직을 포함하지 않는다.

- service.gs
  # 핵심 비즈니스 로직 계층

  - Business logic only
    # 업무 규칙, 판단, 처리 흐름만 담당한다.

  - Must be pure where possible
    # 가능한 한 부작용 없는 순수 함수 형태로 작성한다.

- webapp.gs
  # 웹앱 진입점 모듈

  - HTTP entry points only (doGet / doPost)
    # 외부 요청을 받는 진입 함수만 정의한다.

  - No direct sheet access
    # 웹 요청 처리 중 SpreadsheetApp 직접 접근을 금지한다.

## Concurrency Model
# 동시 실행 환경을 전제로 한 기본 실행 모델 정의

- Multiple executions MAY run in parallel.
  # 여러 실행 인스턴스가 동시에 실행될 수 있음을 전제로 한다.

- All write operations must be wrapped with ScriptLock.
  # 모든 쓰기 작업은 ScriptLock으로 보호되어야 한다.

- Read operations may be unlocked unless explicitly risky.
  # 읽기 작업은 위험하지 않다면 락 없이 수행할 수 있다.

- Never assume single execution context.
  # 한 번에 하나만 실행된다는 가정을 절대 하지 않는다.

## Data Rules
# 시트 데이터 구조 및 사용 규칙

- Spreadsheet rows are append-only unless explicitly stated.
  # 명시되지 않은 한 행은 추가만 가능하며 수정/삭제를 가정하지 않는다.

- Never rely on row index stability.
  # 행 번호가 고정되어 있다고 가정해서는 안 된다.

- Always assume rows may be reordered by filters or sorting.
  # 필터나 정렬로 행 순서가 바뀔 수 있음을 항상 고려해야 한다.

- Image formulas must not be copied as values.
  # IMAGE 함수 결과를 값으로 복사하는 행위를 금지한다.

## Known Pitfalls
# 과거에 실제로 문제를 일으켰던 주의 사항들

- onEdit triggers may fire multiple times.
  # onEdit 트리거는 한 번의 동작에도 여러 번 실행될 수 있다.

- WebApp calls can overlap with manual executions.
  # 웹앱 호출과 수동 실행이 동시에 겹칠 수 있다.

- LockService may silently fail if misused.
  # LockService는 잘못 사용하면 오류 없이 실패할 수 있다.

- QUERY + IMAGE formulas may break when moved.
  # QUERY 결과에 IMAGE 함수가 포함된 경우 이동 시 깨질 수 있다.

## Allowed Patterns
# 허용 및 권장되는 구현 패턴

- Higher-order functions for lock wrapping
  # 락 처리를 고차 함수로 감싸는 패턴을 허용한다.

- Repository pattern for sheet access
  # 시트 접근은 Repository 패턴을 사용한다.

- Early returns for validation failures
  # 검증 실패 시 빠르게 return하는 방식을 권장한다.

- Explicit error throwing over silent failures
  # 조용히 실패하지 말고 명시적으로 에러를 발생시킨다.

## When Uncertain
# 불확실한 상황에서의 기본 행동 규칙

If any behavior is ambiguous,
# 동작이 애매하거나 해석이 불분명한 경우에는

DO NOT guess.
# 추측으로 구현하지 않는다.

Ask for clarification instead.
# 반드시 질문을 통해 명확히 한 후 진행한다.
