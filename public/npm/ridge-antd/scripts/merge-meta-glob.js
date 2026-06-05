const fs = require('fs')
const path = require('path')
const glob = require('glob')

/**
 * 按目录自动扫描 **\/source\/* .meta.json
 * 自动生成同级 meta.json，name 使用 根 package.json 的 name
 */
async function mergeMetaJsonWithGlob () {
  const pattern = '**/source/*.meta.json'
  console.log(`🔍 扫描所有组件: ${pattern}\n`)

  // 🔥 读取根 package.json
  const rootPkgPath = path.resolve(process.cwd(), 'package.json')
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'))
  const rootPackageName = rootPkg.name || 'unknown-package' // 取 name

  glob(pattern, (err, files) => {
    if (err) {
      console.error('❌ 搜索出错:', err.message)
      return
    }
    if (files.length === 0) {
      console.log('❌ 未找到 meta.json 文件')
      return
    }

    // 按【组件根目录】分组（source 的上一级）
    const group = {}
    files.forEach(file => {
      const sourceDir = path.dirname(file)
      const rootDir = path.resolve(path.join(sourceDir, '..')) // 组件根目录
      if (!group[rootDir]) group[rootDir] = []
      group[rootDir].push(file)
    })

    // 遍历每个组件目录，生成各自的 meta.json
    Object.keys(group).forEach(rootDir => {
      const metaFile = path.join(rootDir, 'meta.json')
      const fileList = group[rootDir]

      // 🔥 这里直接用根 package.json 的 name
      const name = rootPackageName
      console.log(`📦 包名: ${name}`)
      console.log(`├─ 来源: ${fileList.length} 个文件`)
      console.log(`└─ 输出: ${metaFile}`)

      // 合并
      const components = []
      fileList.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8')
          const data = JSON.parse(content)
          if (Array.isArray(data)) components.push(...data)
          else components.push(data)
        } catch (e) {
          console.warn(`⚠️  跳过 ${path.basename(file)}: ${e.message}`)
        }
      })

      // 输出最终 meta.json
      const output = {
        name, // 👈 这里已经是根 package.json 的 name
        schemaVersion: '2.0',
        lastUpdated: new Date().toISOString(),
        generatedBy: 'ridge-ui-cli',
        components
      }

      fs.writeFileSync(metaFile, JSON.stringify(output, null, 2), 'utf8')
      console.log(`✅ 生成完成: ${name}\n`)
    })

    console.log('🎉 所有组件 meta.json 生成完毕！')
  })
}

// 运行
mergeMetaJsonWithGlob()
