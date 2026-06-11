/* eslint-disable no-undef */
// eslint-disable-next-line import/first
const fsExtra = require('fs-extra')
const DB = require('../src/nedb')
const path = require('path')

// eslint-disable-next-line no-undef
beforeEach(async () => {
})

test('Store Archive Object', async () => {
  const db = new DB('./test/db2')
  const coll = db.getCollection('test')

  await coll.insertArchive({
    name: 'hello'
  }, {
    formData: {
      search: {
        q: {
          value: 'time'
        }
      }
    },
    objects: [
      {
        package: {
          name: 'time',
          scope: 'unscoped',
          version: '0.12.0',
          description: '"time.h" bindings for Node.js',
          keywords: [
            'date',
            'time',
            'time.h',
            'timezone',
            'setTimezone',
            'getTimezone'
          ],
          date: {
            ts: 1488477502479,
            rel: '5 years ago'
          },
          links: {
            npm: 'https://www.npmjs.com/package/time',
            homepage: 'https://github.com/TooTallNate/node-time#readme',
            repository: 'https://github.com/TooTallNate/node-time',
            bugs: 'https://github.com/TooTallNate/node-time/issues'
          },
          author: {
            name: 'Nathan Rajlich',
            email: 'nathan@tootallnate.net',
            url: 'http://tootallnate.net',
            username: 'tootallnate'
          },
          publisher: {
            name: 'tootallnate',
            avatars: {
              small: '/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82OTMzMDdiNGUwY2I5MzY2ZjM0ODYyYzlkZmFjZDdmYz9zaXplPTUwJmRlZmF1bHQ9cmV0cm8ifQ.bKKjNjVBKvTqZQz_3FTKmWOeKI-viNK3Vz53_v1lGdg',
              medium: '/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82OTMzMDdiNGUwY2I5MzY2ZjM0ODYyYzlkZmFjZDdmYz9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.42ARZaAu08xmBFXZic2Db5IpIuxtQyLLptsjApEMLbI',
              large: '/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82OTMzMDdiNGUwY2I5MzY2ZjM0ODYyYzlkZmFjZDdmYz9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0.BKbjCLRlNqLHxN5yjpyBFJaNbkbcIcBNA07x-Rd37gY'
            }
          },
          maintainers: [
            {
              username: 'tootallnate',
              email: 'nathan@tootallnate.net'
            }
          ],
          keywordsTruncated: false
        },
        flags: {
          unstable: true
        },
        score: {
          final: 0.3316797980493549,
          detail: {
            quality: 0.883848800674803,
            popularity: 0.19007187956261148,
            maintenance: 0
          }
        },
        searchScore: 100000.32
      }
    ],
    total: 24794,
    time: 'Mon Jul 11 2022 01:10:56 GMT+0000 (Coordinated Universal Time)',
    pagination: {
      perPage: 20,
      page: 0
    },
    url: '/search?q=time',
    user: null,
    csrftoken: 'LUmRfhjoFmhcG_oT3Ljyu8A3MtQKB5BtC7H1LjhmZQy',
    notifications: [],
    npmExpansions: [
      'National Poetry Month',
      'Nostalgic Piano Music',
      'Nefarious Pickle Muncher',
      'Narcoleptic Pony Machine',
      'Nomenclature Processing Machine',
      'Narcoleptic Pony Machine',
      'Nibble Plum Meringue',
      'Nice Pithy Motto',
      'Notary Public Mystifier',
      'Nybble Processing Mainframe'
    ]
  })
})

test('Store Archive File By Path', async () => {
  const db = new DB('./test/db2')
  const coll = db.getCollection('test')

  await coll.insertArchive({
    name: 'hello'
  }, __filename)
})

test('Store Archive BigString By Path', async () => {
  const db = new DB('./test/db2')
  const coll = db.getCollection('test')

  await coll.insertArchive({
    name: 'hello'
  }, 'JKLEJLEJKLRJKLELKJREJKLRLKJRJKLflkjgfdjlkdgfjlkgfdlkj')
})

test('Get Archive Object', async () => {
  const db = new DB('./test/db2')
  const coll = db.getCollection('test')

  const inserted = await coll.insertArchive({
    name: 'hello'
  }, {
    name: 'hello',
    pageJSON: {
      a: '1'
    }
  })
  const found = await coll.getArchiveObject(inserted._id)

  expect(found.name).toBe('hello')
  expect(found.pageJSON.a).toBe('1')
})

afterEach(async () => {
  const db = new DB('./test/db2')
  const coll = db.getCollection('test')

  await coll.clean()

  await fsExtra.emptyDirSync(path.resolve(__dirname, './fileStore'))

  // fsExtra.unlinkSync(path.resolve(__dirname, './fileStore'));
})
