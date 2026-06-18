import { loader } from 'ridgejs'

const RIDGE_AI_PROMPT_FILEPATH = 'ridge-metas/RidgeUI4AI.md'

let ridgeUiAIPrompt = null
const loadRidgeUIAIPrompt = async () => {
  if (!ridgeUiAIPrompt) {
    ridgeUiAIPrompt = await loader.loadTextContent(RIDGE_AI_PROMPT_FILEPATH)
  }

  return ridgeUiAIPrompt
}
/**
 * 根据selectedComponents生成对应AI提示词
 */
const generateAIPrompt = async (selectedComponents) => {
  // 1. 去重加载相同的 md 文件
  const pathMap = {}
  for (const comp of selectedComponents) {
    pathMap[comp.libAImdPath] = true
  }

  // 2. 加载所有不重复的 md
  const mdContentMap = {}
  for (const path of Object.keys(pathMap)) {
    try {
      const text = await loader.loadTextContent(path)
      mdContentMap[path] = text || ''
    } catch (err) {
      mdContentMap[path] = ''
    }
  }

  const resultParts = []

  for (const comp of selectedComponents) {
    const { name, libAImdPath } = comp
    const mdText = mdContentMap[libAImdPath]
    if (!mdText) continue

    // ----------------------------
    // 核心修复：按空行分割段落，再匹配
    // ----------------------------
    const paragraphs = mdText.split(/\n\s*\n/) // 按【完整空行】切成一个个段落
    const targetName = name.trim()

    // 查找以 “组件名(xxx)” 或 “组件名 (xxx)” 开头的段落
    const foundParagraph = paragraphs.find(p => {
      const trimLine = p.trimStart()
      return trimLine.startsWith(targetName)
    })

    if (foundParagraph) {
      resultParts.push(foundParagraph.trim())
    }
  }

  const ridgeAi = await loadRidgeUIAIPrompt()

  // 拼接所有段落
  return ridgeAi + '\n\n\n下面是制作应用需要的组件：\n' + resultParts.join('\n\n\n\n') +
'按照上述描述和相关组件，生成下面的应用， 包含JSON 配置和JS 脚本：（如果组件不够，可以先提示我缺失哪些组件）'
}

export { generateAIPrompt }
