import mongodb, { ObjectID } from 'mongodb'
import { removeIdProp } from './helpers'
import config from '../config'

const MongoClient = mongodb.MongoClient

let client

export const connectDB = async () => {
  if (!client) {
    client = await MongoClient.connect(config.mongoUrl, {
      useNewUrlParser: true
    })
  }
  return { db: client.db(config.dbName) }
}

export const close = async () => {
  if (client) {
    client.close()
  }
  client = undefined
}

const formatReturnSuccess = data => {
  return { data: data, error: '' }
}

const formatReturnError = error => {
  return { data: [], error: error.message }
}

const logError = (functionName, error) => {
  console.error(`Error: dbFunctions.${functionName}`, error.message)
}

/**
 *
 * @param {string} collection the name of a collection
 */
export const dropCollection = async collection => {
  try {
    const { db } = await connectDB()
    const ret = await db.collection(collection).drop()
    return formatReturnSuccess(ret)
  } catch (e) {
    if ((e.message = 'ns not found')) {
      return true
    } else {
      logError('dropCollection', e)
      return formatReturnError(e)
    }
  }
}

/**
 * 
 * @param {string} collection the name of a collection
 * @param {object} data a documnet, without _id, to be inserted
 */
export const insertOne = async (collection, data) => {
  try {
    const { db } = await connectDB()
    const ret = await db.collection(collection).insertOne(data)
    return formatReturnSuccess(ret.ops[0])
  }
  catch (e) {
    console.error('ERROR: dbFunctions.insertOne', e)
    return formatReturnError(e)
  }
}

/**
 * 
 * @param {string} collection the name of a collection
 * @param {Array} data  an array of documents, without _id, to be inserted
 */
export const insertMany = async (collection, data) => {
  try {
    const { db } = await connectDB()
    const ret = await db.collection(collection).insertMany(data)
    return formatReturnSuccess(ret.ops)
  }
  catch (e) {
    console.warn('ERROR: dbFunctions.insertMany', e.message)
    return formatReturnError(e)
  }
}

/**
 * 
 * @param {string} collection the name of a collection
 * @param {object} filter filter criteria
 * @param {object} project a valid projection
 */
export const find = async (collection, filter = {}, project = {}) => {
  try {
    const { db } = await connectDB()
    const ret = await db.collection(collection).find(filter).project(project).toArray()
    console.log('ret', ret)
    return formatReturnSuccess(ret)
  }
  catch (e) {
    logError('find', e)
    return formatReturnError(e)
  }
}
