import { ObjectID } from  'mongodb'
import { omit } from 'ramda'

export const objectIdFromHexString = async (hexId) => {
  try {
    return await ObjectID.createFromHexString(hexId)
  }
  catch (e) {
    console.error('ERROR /db/helpers.js.objectidFromHexString', e)
  }
}

export const getObjectId = async (id) => {
  if (ObjectID.isValid(id)) {
    const objId = await objectIdFromHexString(id)

    return objId
  } else {
    throw new Error('ERROR /db/helpers.js.getObjectId', e)
  }
}

export const removeIdProp = (obj) => {
  return omit(['_id'], obj)
}