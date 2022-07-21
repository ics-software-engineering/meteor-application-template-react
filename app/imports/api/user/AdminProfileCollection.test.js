import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { AdminProfiles } from './AdminProfileCollection';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AdminProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          (firstName, lastName) => {
            const email = faker.internet.email();
            const docID = AdminProfiles.define({ email, firstName, lastName });
            expect(AdminProfiles.isDefined(docID)).to.be.true;
            AdminProfiles.removeIt(docID);
            expect(AdminProfiles.isDefined(docID)).to.be.false;
          },
        ),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const docID1 = AdminProfiles.define({ email, firstName, lastName });
      const docID2 = AdminProfiles.define({ email, firstName, lastName });
      expect(docID1).to.equal(docID2);
    });

    it('Can update', function test3(done) {
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const password = faker.internet.password();
      const docID = AdminProfiles.define({ email, firstName, lastName, password });
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), (fName, lName) => {
          AdminProfiles.update(docID, { firstName: fName, lastName: lName });
          const admin = AdminProfiles.findDoc(docID);
          expect(admin.firstName).to.equal(fName);
          expect(admin.lastName).to.equal(lName);
        }),
      );
      done();
    });
  });
}
