const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { copySync } = require('fs-extra') // 必须装：npm i fs-extra --save-dev

/**
 * 按目录自动扫描 **\/meta/*.meta.json
 * 自动生成同级 meta.json，name 使用 根 package.json 的 name
 * 构建完自动复制 → ../../public/npm/[当前文件夹名]
 */
async function mergeMetaJsonWithGlob () {
  const pattern = '**/meta/*.meta.json'
  console.log(`🔍 扫描所有组件: ${pattern}\n`)

  // 读取根 package.json
  const rootPkgPath = path.resolve(process.cwd(), 'package.json')
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'))
  const rootPackageName = rootPkg.name || 'unknown-package'

  // 🔥 获取 **当前包所在目录名称**（用于拼接到目标路径）
  const currentFolderName = path.basename(process.cwd())

  glob(pattern, (err, files) => {
    if (err) {
      console.error('❌ 搜索出错:', err.message)
      return
    }
    if (files.length === 0) {
      console.log('❌ 未找到 meta.json 文件')
      return
    }

    const group = {}
    files.forEach(file => {
      const sourceDir = path.dirname(file)
      const rootDir = path.resolve(path.join(sourceDir, '..'))
      if (!group[rootDir]) group[rootDir] = []
      group[rootDir].push(file)
    })

    Object.keys(group).forEach(rootDir => {
      const metaFile = path.join(rootDir, 'meta.json')
      const fileList = group[rootDir]
      const name = rootPackageName

      console.log(`📦 包名: ${name}`)
      console.log(`├─ 来源: ${fileList.length} 个文件`)
      console.log(`└─ 输出: ${metaFile}`)

      const components = []
      fileList.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8')
          const data = JSON.parse(content)
          if (Array.isArray(data)) components.push(...data)
          else components.push(data)
        } catch (e) {
          console.warn(`⚠️ 跳过 ${path.basename(file)}: ${e.message}`)
        }
      })

      const output = {
        name,
        schemaVersion: '2.0',
        lastUpdated: new Date().toISOString(),
        generatedBy: 'ridge-ui-cli',
        components
      }

      fs.writeFileSync(metaFile, JSON.stringify(output, null, 2), 'utf8')
      console.log(`✅ 生成完成: ${name}\n`)
    })

    console.log('🎉 所有组件 meta.json 生成完毕！')

    // ✅ 开始复制
    copyNpmPackageToTarget(currentFolderName)
  })
}

/**
 * 复制构建好的 dist 目录 → ../../public/npm/[当前目录名]
 */
function copyNpmPackageToTarget (currentFolderName) {
  // 源目录（你的构建产物）
  const sourceDir = path.resolve(process.cwd(), 'dist')

  // 目标目录：../../public/npm/当前目录名
  const targetDir = path.resolve(
    __dirname,
    '../../public/npm',
    currentFolderName
  )

  try {
    console.log('\n🚀 开始复制构建产物...')
    console.log(`📂 源: ${sourceDir}`)
    console.log(`📂 目标: ${targetDir}`)

    // 覆盖复制
    copySync(sourceDir, targetDir, { overwrite: true, recursive: true })

    console.log('✅ 复制并覆盖完成！')
  } catch (err) {
    console.error('❌ 复制失败:', err.message)
  }
}

// 运行
mergeMetaJsonWithGlob()
