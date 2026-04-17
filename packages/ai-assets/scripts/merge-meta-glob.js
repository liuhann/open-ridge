const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { copyFileSync } = require('fs')

/**
 * 使用 glob 模式匹配所有 meta.json 文件并合并
 * @param {string} pattern - glob 模式
 * @param {string} outputFile - 输出文件路径
 * @param {string} copyTargetPath - 复制目标路径（可选）
 */
async function mergeMetaJsonWithGlob (pattern, outputFile, copyTargetPath) {
  console.log(`🔍 搜索模式: ${pattern}`)
  console.log(`📤 输出文件: ${outputFile}`)
  if (copyTargetPath) {
    console.log(`📋 生成后将复制到: ${copyTargetPath}\n`)
  } else {
    console.log('📋 不执行复制操作\n')
  }

  glob(pattern, (err, files) => {
    if (err) {
      console.error('❌ 搜索文件时出错:', err.message)
      return
    }

    if (files.length === 0) {
      console.log('❌ 未找到匹配的文件')
      return
    }

    console.log(`📁 找到 ${files.length} 个文件:\n`)

    const mergedArray = []
    let successCount = 0
    let errorCount = 0

    files.forEach((file, index) => {
      try {
        const content = fs.readFileSync(file, 'utf8')
        const data = JSON.parse(content)

        const enhancedData = {
          ...data,
          _meta: {
            filePath: file,
            fileName: path.basename(file),
            dir: path.dirname(file)
          }
        }

        if (Array.isArray(data)) {
          data.forEach((item, i) => {
            mergedArray.push({
              ...item,
              _meta: { filePath: file, index: i }
            })
          })
        } else {
          mergedArray.push(enhancedData)
        }

        successCount++
        console.log(`  [${index + 1}/${files.length}] ✓ ${file}`)
      } catch (error) {
        errorCount++
        console.error(`  [${index + 1}/${files.length}] ✗ ${file}: ${error.message}`)
        mergedArray.push({ _error: error.message, _meta: { filePath: file } })
      }
    })

    // 读取 package.json
    const packageJSON = fs.readFileSync('./package.json', 'utf8')
    const packageJSONObject = JSON.parse(packageJSON)

    // 写入输出文件
    fs.writeFileSync(
      outputFile,
      JSON.stringify(
        {
          name: packageJSONObject.name,
          version: packageJSONObject.version,
          schemaVersion: '2.0',
          lastUpdated: new Date(),
          generatedBy: 'ridge-ui-cli',
          components: mergedArray
        },
        null,
        2
      )
    )

    // ======================
    // 关键：自动复制到目标路径
    // ======================
    if (copyTargetPath) {
      try {
        // 确保目标目录存在
        const targetDir = path.dirname(copyTargetPath)
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true })
        }

        // 执行复制
        copyFileSync(outputFile, copyTargetPath)
        console.log(`\n✅ 已复制文件到: ${copyTargetPath}`)
      } catch (err) {
        console.error(`\n❌ 复制文件失败: ${err.message}`)
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ 合并完成！')
    console.log(`📁 匹配文件: ${files.length} 个`)
    console.log(`✅ 成功解析: ${successCount} 个`)
    console.log(`❌ 解析失败: ${errorCount} 个`)
    console.log(`📄 输出文件: ${path.resolve(outputFile)}`)
    console.log(`📊 总记录数: ${mergedArray.length} 条`)
    console.log('='.repeat(50))
  })
}

// ========== 命令行参数解析 ==========
const args = process.argv.slice(2)
const pattern = args[0] || '**/*.meta.json'
const outputFile = args[1] || './meta.json'
const copyTargetPath = args[2] || '' // 第三个参数：复制目标路径

mergeMetaJsonWithGlob(pattern, outputFile, copyTargetPath)
