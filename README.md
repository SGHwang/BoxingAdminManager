# Project Overview
<!-- # 프로젝트 전반의 개요를 설명하는 섹션이다. -->

This project is a Google Apps Script–based system for managing members
<!-- 이 프로젝트는 Google Apps Script 기반의 회원 관리 시스템이다. -->

using Google Sheets as the primary data store.
<!-- # Google Sheets를 주요 데이터 저장소로 사용한다. -->

The system is designed to operate in a real production environment
<!-- # 이 시스템은 실제 운영 환경에서 사용되는 것을 전제로 설계되었다. -->

with concurrent executions and external HTTP access via WebApp.
<!-- # 동시 실행 상황과 WebApp을 통한 외부 HTTP 접근을 지원한다. -->

## Local Development

- `.clasp.json` is ignored by Git.
- Copy `.clasp.json.example` and provide your own scriptId.


## Purpose
<!-- # 이 프로젝트가 존재하는 목적을 정의한다. -->

- Provide a reliable member management system
  <!-- # 안정적으로 회원 정보를 관리하는 시스템을 제공한다. -->

- Support registration and lookup via HTTP endpoints
  <!-- # HTTP 엔드포인트를 통해 회원 등록 및 조회를 지원한다. -->

- Ensure data consistency under concurrent executions
  <!-- # 동시 실행 환경에서도 데이터 일관성을 유지한다. -->


## Features
<!-- # 구현해야 할 기능 목록을 정의한다. -->

- Register a new member via HTTP request
  <!-- # HTTP 요청을 통해 새로운 회원을 등록한다. -->

- Prevent duplicate member registration
  <!-- # 중복 회원 등록을 방지한다. -->

- Store member data in Google Sheets
  <!-- # 회원 데이터를 Google Sheets에 저장한다. -->

- Store uploaded photos in Google Drive and save only their links in the spreadsheet
  <!-- # 업로드된 사진은 Google Drive에 저장하고, 시트에는 해당 파일의 링크만 저장한다. -->

- Return structured JSON responses
  <!-- # 구조화된 JSON 형태로 응답을 반환한다. -->

## Data Model
<!-- # 저장되는 데이터의 구조를 정의한다. -->

Each member record consists of:
<!-- # 각 회원 데이터는 다음 항목들로 구성된다. -->

- name: string
  <!-- # 회원 이름 -->

- phone: string
  <!-- # 회원 전화번호 -->

- photoUrl: string
  <!-- # Google Drive에 저장된 사진 파일의 링크 -->

- createdAt: timestamp
  <!-- # 회원이 등록된 시각 -->


## API Contract
<!-- # 외부에서 호출하는 API의 입력과 출력 규약을 정의한다. -->

### POST /register
<!-- # 회원 등록을 위한 HTTP 엔드포인트이다. -->

Registers a new member.
<!-- # 새로운 회원을 등록하는 기능이다. -->

Request Body (JSON):
<!-- # 요청 본문은 JSON 형식이다. -->

- name: string (required)
  <!-- # 회원 이름 (필수 값) -->

- phone: string (required)
  <!-- # 회원 전화번호 (필수 값) -->

- photo: file or base64 string (optional)
  <!-- # 회원 사진 (선택 사항, 업로드 데이터) -->

Response (JSON):
<!-- # 응답은 JSON 형식으로 반환된다. -->

- success: boolean
  <!-- # 요청 성공 여부 -->

- message: string
  <!-- # 처리 결과에 대한 설명 메시지 -->

- photoUrl: string (optional)
  <!-- # Google Drive에 저장된 사진의 접근 링크 -->


## Business Rules
<!-- # 비즈니스적으로 반드시 지켜져야 하는 규칙을 정의한다. -->

- Phone numbers must be unique.
  <!-- # 전화번호는 회원 간에 중복될 수 없다. -->

- Registration must be idempotent.
  <!-- # 동일한 요청이 반복되어도 결과는 한 번만 반영되어야 한다. -->

- If validation fails, no data should be written.
  <!-- # 검증에 실패한 경우 어떤 데이터도 저장되지 않아야 한다. -->

- Photos must never be stored directly in the spreadsheet.
  <!-- # 사진 데이터 자체를 시트에 직접 저장해서는 안 된다. -->



## File Storage
<!-- # 파일(사진) 저장 방식에 대한 기준을 정의한다. -->

- All photos are stored in Google Drive.
  <!-- # 모든 사진 파일은 Google Drive에 저장한다. -->

- The spreadsheet stores only Drive file links.
  <!-- # 시트에는 Drive 파일의 링크만 저장한다. -->

- The spreadsheet must not contain binary image data.
  <!-- # 시트에 바이너리 이미지 데이터가 포함되어서는 안 된다. -->


## Error Handling
<!-- # 오류 상황에 대한 처리 기준을 정의한다. -->

- Validation errors should return a clear message.
  <!-- # 검증 오류 발생 시 명확한 메시지를 반환해야 한다. -->

- Unexpected errors should be reported explicitly.
  <!-- # 예상하지 못한 오류는 명시적으로 보고되어야 한다. -->


## Out of Scope
<!-- # 명시적으로 구현 대상에서 제외되는 기능들이다. -->

The following features are explicitly out of scope
<!-- # 아래 기능들은 명확히 범위 밖으로 정의된다. -->

and must not be implemented unless requested:
<!-- # 별도의 요청이 없는 한 구현해서는 안 된다. -->

- Member deletion
  <!-- # 회원 삭제 기능 -->

- Data export
  <!-- # 데이터 내보내기 기능 -->

- Admin-only features
  <!-- # 관리자 전용 기능 -->


## Optional Features
<!-- # 요청이 있을 경우에만 구현 가능한 선택 기능들이다. -->

The following features may be implemented
<!-- # 아래 기능들은 구현될 수 있으나 -->

only if explicitly requested:
<!-- # 반드시 명시적인 요청이 있을 때만 가능하다. -->

- Update existing member data
  <!-- # 기존 회원 정보 수정 기능 -->

- CSV export
  <!-- # CSV 형식으로 데이터 내보내기 -->


## Non-Goals
<!-- # 이 프로젝트에서 목표로 하지 않는 항목들이다. -->

- UI rendering
  <!-- # 사용자 인터페이스(UI) 구현 -->

- Performance optimization beyond correctness
  <!-- # 정합성을 넘는 과도한 성능 최적화 -->

- Analytics or reporting features
  <!-- # 분석 또는 리포팅 기능 -->


## Assumptions
<!-- # 프로젝트가 전제로 하는 가정들이다. -->

- Google Sheets is the single source of truth.
  <!-- # Google Sheets를 유일한 기준 데이터로 간주한다. -->

- External clients follow the documented API contract.
  <!-- # 외부 클라이언트는 문서화된 API 규약을 따른다고 가정한다. -->


## How to Work on This Project (for AI and humans)
<!-- # 이 프로젝트를 작업할 때의 기본 원칙이다. -->

- Follow the rules defined in context.md.
  <!-- # context.md에 정의된 규칙을 따른다. -->

- Implement only what is explicitly described above.
  <!-- # 위에서 명시된 내용만 구현한다. -->

- If requirements are unclear, ask for clarification.
  <!-- # 요구사항이 불명확할 경우 반드시 질문한다. -->
