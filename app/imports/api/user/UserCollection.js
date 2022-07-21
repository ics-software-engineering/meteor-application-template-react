import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import { Stuffs } from '../stuff/StuffCollection';

/**
 * Represents a user, which is someone who has a Meteor account.
 *
 * Users are defined when the various Profile collections are initialized, so the User collection is the union
 * of Users, plus the single Admin account who also has a Meteor account.
 *
 * Note that this collection does not extend any of our Base collections, because it has a very limited API
 * which should be used by clients to access the various Profile collections.
 *
 * It is not saved out or restored when the DB is dumped. It is not listed in RadGrad.collections.
 *
 * Clients provide a "user" as a parameter, which is either the username (i.e. email) or userID.
 */
class UserCollection {
  _collectionName;

  constructor() {
    this._collectionName = 'UserCollection';
  }

  _generateCredential() {
    if (Meteor.isTest || Meteor.isAppTest || Meteor.settings.public.development) {
      return 'changeme';
    }
    // adapted from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let credential = '';
    const maxPasswordLength = 30;
    const minPasswordLength = 6;
    const passwordLength = Math.floor(Math.random() * (maxPasswordLength - (minPasswordLength + 1))) + minPasswordLength;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < passwordLength; i++) {
      credential += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return credential;
  }

  /**
   * Define a new user, which means creating an entry in Meteor.Accounts.
   * This is called in the various Profile define() methods.
   * @param username The username to be defined (must be an email address).
   * @param password The password for the user.
   * @param role The role.
   * @returns { String } The docID of the newly created user.
   * @throws { Meteor.Error } If the user exists.
   */
  define({ username, role, password }) {
    // if (Meteor.isServer) {
    Roles.createRole(role, { unlessExists: true });
    // In test Meteor.settings is not set from settings.development.json so we use _.get to see if it is set.
    const credential = password || this._generateCredential();
    if (_.get(Meteor, 'settings.public.development', false)) {
      const userID = Accounts.createUser({ username, email: username, password: credential });
      Roles.addUsersToRoles(userID, [role]);
      console.log(`Defining ${role} ${username} with password ${credential}`);
      return userID;
    }
    // Otherwise define this user with a Meteor login and randomly generated password.
    console.log(`Defining ${role} ${username} with password ${credential}`);
    const userID = Accounts.createUser({ username, email: username, password: credential });
    Roles.addUsersToRoles(userID, [role]);
    return userID;
    // }
    // return undefined;
  }

  /**
   * Asserts that the passed user has the specified role.
   * @param user The user (username or userID).
   * @param role The role or an array of roles.
   * @throws { Meteor.Error } If the user does not have the role, or if user or role is not valid.
   */
  assertInRole(user, role) {
    // console.log('assertInRole(%o, %o)', user, role);
    const userID = this.getID(user);
    const profile = this.getProfile(userID);
    if (Array.isArray(role)) {
      if (!(role.includes(profile.role))) {
        throw new Meteor.Error(`${userID} (${this.getProfile(userID).username}) is not in role ${role}.`);
      }
    } else if (profile.role !== role) {
      throw new Meteor.Error(`${userID} (${this.getProfile(userID).username}) is not in role ${role}.`);
    }
  }

  /**
   * Returns true if user is referenced by other "public" entities. Specifically user owns Stuff.
   * Used to determine if user can be deleted.
   * @param user
   * @return {boolean}
   */
  isReferenced(user) {
    return Stuffs.find({ owner: user }).fetch().length > 0;
  }

  /**
   * Returns true if user is a defined userID or username.
   * @param user The user.
   * @returns { boolean } True if user is defined, false otherwise.
   */
  isDefined(user) {
    const userDoc = (Meteor.users.findOne({ _id: user })) || (Meteor.users.findOne({ username: user }));
    return userDoc;
  }

  /**
   * Returns the userID associated with user, or throws an error if not defined.
   * @param user The user (username or userID).
   * @returns { String } The userID
   * @throws { Meteor.Error } If user is not a defined username or userID.
   */
  getID(user) {
    const userDoc = (Meteor.users.findOne({ _id: user })) || (Meteor.users.findOne({ username: user }));
    if (!userDoc) {
      console.error('Error: user is not defined: ', user);
    }
    return userDoc?._id;
  }

  /**
   * Returns the userIDs associated with users, or throws an error if any cannot be found.
   * @param { String[] } users An array of valid users.
   * @returns { String[] } The docIDs associated with users.
   * @throws { Meteor.Error } If any instance is not a user.
   */
  getIDs(users) {
    let ids;
    try {
      ids = (users) ? users.map((instance) => this.getID(instance)) : [];
    } catch (err) {
      throw new Meteor.Error(`Error in getIDs(): Failed to convert one of ${users} to an ID.`);
    }
    return ids;
  }

  /**
   * Returns the profile document associated with user.
   * @param user The username or userID.
   * @returns { Object } The profile document.
   * @throws { Meteor.Error } If the document was not found.
   */
  getProfile(user) {
    // First, let's check to see if user is actually a profile (or looks like one). If so, just return it.
    if (_.isObject(user) && _.has(user, 'firstName') && _.has(user, 'lastName') && _.has(user, 'role')) {
      return user;
    }
    const profile = this.hasProfile(user);
    if (!profile) {
      console.error(`No profile found for user ${user}`);
      throw new Meteor.Error(`No profile found for user ${user}`);
    }
    return profile;
  }

}

export const Users = new UserCollection();
