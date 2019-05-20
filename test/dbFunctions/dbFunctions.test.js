import { expect } from 'chai'
import { fourTodos } from './fixture'
import { 
  dropCollection, 
  find,
  insertMany,
  insertOne 
} from 'db'

const collectionName = 'todos'

describe('dbFunctions', () => {
  beforeEach(async function() {
    console.log(' ** beforeEach ** ');
    
    await dropCollection('todos')
  })
  describe('test insertOne', function() {
    // insertOne will only be used for new todos.
    // for new todos, competed is always false and set by the server
    const newData = { title: 'todo added' }
    it('insertOne: should insert new document', async function() {
      const i = await insertOne(collectionName, newData)
      expect(i.data._id).to.be.not.null
      expect(i.data.title).to.equal('todo added')
    })
  })

  describe('test insertMany', function() {
    it('insertMany: should insert 4 todos', async function() {
      const i = await insertMany('todos', fourTodos)
      expect(i.data.length).to.equal(4)
    })
  })

  describe('test find', function() {
    it('find: should return 4 todos', async function() {
      const f = await find('todos')
      expect(f.data.length).to.equal(4)
    })
  })

})


