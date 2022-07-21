import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DDP } from 'meteor/ddp-client';
import faker from 'faker';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Stuffs } from '../api/stuff/StuffCollection';
import { ROLE } from '../api/role/Role';
import { AdminProfiles } from '../api/user/AdminProfileCollection';
import { UserProfiles } from '../api/user/UserProfileCollection';

export function withSubscriptions() {
  return new Promise((resolve => {
    // Add the collections to subscribe to.
    AdminProfiles.subscribe();
    Stuffs.subscribeStuff();
    UserProfiles.subscribe();
    const poll = Meteor.setInterval(() => {
      if (DDP._allSubscriptionsReady()) {
        Meteor.clearInterval(poll);
        resolve();
      }
    }, 200);
  }));
}

/**
 * Defines a test admin user.
 * @type {ValidatedMethod}
 */
export const defineTestAdminUser = new ValidatedMethod({
  name: 'Test.defineAdminUser',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    // Only do this if in test or test-app.
    if (Meteor.isTest || Meteor.isAppTest) {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const users = Accounts.createUser({
        username,
        email,
        password,
      });
      Roles.createRole(ROLE.ADMIN, { unlessExists: true });
      Roles.addUsersToRoles([users], [ROLE.ADMIN]);
      return { username, email, password };
    }
    throw new Meteor.Error('Need to be in test mode to call this method.');
  },
});

/**
 * Defines a test user.
 * @type {ValidatedMethod}
 */
export const defineTestUser = new ValidatedMethod({
  name: 'Test.defineUser',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    // Only do this if in test or test-app.
    if (Meteor.isTest || Meteor.isAppTest) {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      // console.log('defineTestUser', username, password);
      const users = Accounts.createUser({
        username,
        email,
        password,
      });
      Roles.createRole(ROLE.USER, { unlessExists: true });
      Roles.addUsersToRoles([users], [ROLE.USER]);
      return { username, email, password };
    }
    throw new Meteor.Error('Need to be in test mode to call this method.');
  },
});
/**
 * Returns a Promise that resolves if one can successfully login with the passed credentials.
 * Credentials default to the standard admin username and password.
 * @memberOf api/test
 */
export function withLoggedInUser({ username = 'admin@foo.com', password = 'changeme' } = {}) {
  return new Promise((resolve, reject) => {
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.log('Error: withLoggedInUser', error);
        reject();
      } else {
        resolve();
      }
    });
  });
}

/**
 * Returns a Promise that resolves if one can successfully login with the passed credentials.
 * Credentials default to the standard admin username and password.
 * @memberOf api/test
 */
export function logOutUser() {
  return new Promise((resolve, reject) => {
    Meteor.logout((error) => {
      if (error) {
        console.log('Error: logOutUser', error);
        reject();
      } else {
        resolve();
      }
    });
  });
}
