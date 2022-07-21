import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

const rolesToCollectionNames = {};
rolesToCollectionNames[ROLE.ADMIN] = 'AdminProfileCollection';
rolesToCollectionNames[ROLE.USER] = 'UserProfileCollection';

class BaseProfileCollection extends BaseCollection {
  constructor(type, schema) {
    super(type, schema.extend(new SimpleSchema({
      email: String,
      firstName: String,
      lastName: String,
      role: String,
      userID: SimpleSchema.RegEx.Id,
    })));
  }

  /**
   * The subclass methods need a way to create a profile with a valid, though fake, userId.
   * @returns {string}
   */
  getFakeUserId() {
    return 'ABCDEFGHJKLMNPQRS';
  }

  /**
   * Returns the name of the collection associated with the given profile.
   * @param profile A Profile object.
   * @returns  { String } The name of a profile collection.
   */
  getCollectionNameForProfile(profile) {
    return rolesToCollectionNames[profile.role];
  }

  /**
   * Returns the Profile's docID associated with instance, or throws an error if it cannot be found.
   * If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.
   * If instance is the value for the username field in this collection, then return that document's ID.
   * If instance is the userID for the profile, then return the Profile's ID.
   * If instance is an object with an _id field, then that value is checked to see if it's in the collection.
   * @param { String } instance Either a valid docID, valid userID or a valid slug string.
   * @returns { String } The docID associated with instance.
   * @throws { Meteor.Error } If instance is not a docID or a slug.
   */
  getID(instance) {
    let id;
    // If we've been passed a document, check to see if it has an _id field and use that if available.
    if (_.isObject(instance) && _.has(instance, '_id')) {
      // @ts-ignore
      instance = instance._id; // eslint-disable-line no-param-reassign, dot-notation
    }
    // If instance is the value of the email field for some document in the collection, then return its ID.
    const emailBasedDoc = this._collection.findOne({ email: instance });
    if (emailBasedDoc) {
      return emailBasedDoc._id;
    }
    // If instance is the value of the userID field for some document in the collection, then return its ID.
    const userIDBasedDoc = this._collection.findOne({ userID: instance });
    if (userIDBasedDoc) {
      return userIDBasedDoc._id;
    }
    // Otherwise see if we can find instance as a docID.
    try {
      id = (this._collection.findOne({ _id: instance }));
    } catch (err) {
      throw new Meteor.Error(`Error in ${this._collectionName} getID(): Failed to convert ${instance} to an ID.`);
    }
    return id;
  }

  /**
   * Returns the profile associated with the specified user.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document.
   * @throws { Meteor.Error } If user is not a valid user, or profile is not found.
   */
  getProfile(user) {
    const userID = Users.getID(user);
    const doc = this._collection.findOne({ userID });
    if (!doc) {
      throw new Meteor.Error(`No profile found for user ${user}`);
    }
    return doc;
  }

  /**
   * Returns the profile document with email, or null if none is found.
   * @param email An email such as 'john@foo.com'.
   * @return {Object} The profile document or null.
   */
  findByEmail(email) {
    return this._collection.findOne({ email });
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  hasProfile(user) {
    const userID = Users.getID(user);
    return this._collection.findOne({ userID });
  }

  /**
   * Returns the userID associated with the given profile.
   * @param profileID The ID of the profile.
   * @returns The associated userID.
   */
  getUserID(profileID) {
    return this._collection.findOne(profileID).userID;
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  removeIt(profileID) {
    // console.log('BaseProfileCollection.removeIt', profileID);
    const profile = this._collection.findOne({ _id: profileID });
    const userID = profile.userID;
    if (!Users.isReferenced(userID)) {
      Meteor.users.remove({ _id: userID });
      return super.removeIt(profileID);
    }
    throw new Meteor.Error(`User ${profile.email} owns Stuff.`);
  }

}

export default BaseProfileCollection;
