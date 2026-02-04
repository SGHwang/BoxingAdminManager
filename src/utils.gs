function withLock(fn, timeoutMs = 30000) {
  const lock = LockService.getScriptLock();
  lock.waitLock(timeoutMs);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function newUid() {
  return Utilities.getUuid();
}


function alertTest(target){
  SpreadsheetApp.getUI().alert(target);
}

function logTriggerError_(ss, err, context) {
  const name = "트리거로그";
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);

  if (sh.getLastRow() === 0) {
    sh.appendRow(["시간", "함수", "시트", "셀", "메시지", "스택", "컨텍스트"]);
  }

  sh.appendRow([
    new Date(),
    "onEditMoveRowByStatus",
    context?.sheetName || "",
    context?.a1 || "",
    String(err && err.message ? err.message : err),
    err && err.stack ? String(err.stack).slice(0, 5000) : "",
    context ? JSON.stringify(context).slice(0, 5000) : ""
  ]);
}
