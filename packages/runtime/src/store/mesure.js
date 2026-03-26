function measureExecutionTime (codeBlock, enabled) {
  if (!enabled) {
    // 如果性能评估被禁用，则直接执行代码块
    codeBlock()
    return -1
  }
  const startTime = performance.now()
  codeBlock() // 执行你的代码块
  const endTime = performance.now()
  const executionTime = endTime - startTime // 计算执行时间（毫秒）

  return executionTime
}

async function measureAsyncExecutionTime (codeBlock, enabled) {
  if (!enabled) {
    // 如果性能评估被禁用，则直接执行代码块
    await codeBlock()
    return -1
  }
  const startTime = performance.now()
  await codeBlock() // 执行你的代码块
  const endTime = performance.now()
  const executionTime = endTime - startTime // 计算执行时间（毫秒）

  return executionTime
}

export { measureExecutionTime, measureAsyncExecutionTime }
