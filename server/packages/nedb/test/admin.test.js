/* eslint-disable no-undef */
// eslint-disable-next-line import/first
const DB = require('../src/nedb')
const db = new DB('./test/project')

beforeEach(async () => {
  const coll1 = await db.getCollection('coll1')
  const coll3 = await db.getCollection('coll3')
  const coll2 = await db.getCollection('coll2')

  await coll1.insert({})
  await coll2.insert({})
  await coll3.insert({})

  // await sleep();
})

test('DB List No Exist', async () => {
  const dbs = await DB.getDbs('../src/nedb')

  expect(dbs).toBe(null)
})

test('Admin Test Demo', async () => {
  const colls = await db.getCollections()

  expect(colls.length).toBe(3)
})

test('Check Exist', async () => {
  let exist = await DB.checkExist('./test/project')

  expect(exist).toBe(true)

  exist = await DB.checkExist('./test/projectn')

  expect(exist).toBe(false)
})

test('Check Exist (Newdb)', async () => {
  let exist = new DB('./test/project')

  expect(await exist.exist()).toBe(true)

  exist = new DB('./test/projectn')

  expect(await exist.exist()).toBe(false)
})

test('DBList Test', async () => {
  const dbs = await DB.getDbs('./test')

  expect(dbs.length > 0).toBe(true)
})

test('Clone Db', async () => {
  const toCloneDB = new DB('./test/toClone')
  const coll1 = await toCloneDB.getCollection('coll1')
  const coll3 = await toCloneDB.getCollection('coll3')
  const coll2 = await toCloneDB.getCollection('coll2')

  await coll1.insert({})
  await coll2.insert({})
  await coll3.insert({})

  const result = await toCloneDB.clone(new DB('./test/cloned'), true)

  expect(result.coll1 != null).toBeTruthy()
  expect(result.coll1 != null).toBeTruthy()
  expect(result.coll1 != null).toBeTruthy()

  await new DB('./test/toClone').drop()
  await new DB('./test/cloned').drop()
})

test('Clone Db OverWrite', async () => {
  const toCloneDB = new DB('./test/toCloneOver')
  const coll1 = await toCloneDB.getCollection('coll1')
  const coll3 = await toCloneDB.getCollection('coll3')
  const coll2 = await toCloneDB.getCollection('coll2')

  await coll1.insert({})
  await coll2.insert({})
  await coll3.insert({})

  await toCloneDB.clone(new DB('./test/clonedOver'), false)

  const result = await toCloneDB.clone(new DB('./test/clonedOver'), false)

  expect(result).toBe(null)
  await new DB('./test/toCloneOver').drop()
  await new DB('./test/clonedOver').drop()
})

test('Db Export', async () => {
  const toExportDb = new DB('./test/toExport')
  const coll1 = await toExportDb.getCollection('coll1')
  const coll3 = await toExportDb.getCollection('coll3')
  const coll2 = await toExportDb.getCollection('coll2')

  await coll1.insert({})
  await coll2.insert({})
  await coll3.insert({})

  const readStream = await toExportDb.export()

  expect(readStream.path != null).toBeTruthy()

  await toExportDb.drop()
})

test('DB Drop', async () => {
  await db.drop()
  const exist = await DB.checkExist('./test/project')

  expect(exist).toBe(false)
})
