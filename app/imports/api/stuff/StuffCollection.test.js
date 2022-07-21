import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Stuffs, stuffConditions } from './StuffCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('StuffCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem(2),
          fc.integer(1, 10),
          fc.lorem(1),
          fc.integer(0, stuffConditions.length - 1),
          (name, quantity, owner, choice) => {
            const condition = stuffConditions[choice];
            const docID = Stuffs.define({
              name,
              quantity,
              owner,
              condition,
            });
            expect(Stuffs.isDefined(docID)).to.be.true;
            Stuffs.removeIt(docID);
            expect(Stuffs.isDefined(docID)).to.be.false;
          },
        ),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const name = faker.animal.dog();
      const quantity = faker.datatype.number({ min: 1, max: 5 });
      const owner = faker.internet.email();
      const condition = stuffConditions[Math.floor(Math.random() * stuffConditions.length)];
      const docID1 = Stuffs.define({ name, quantity, condition, owner });
      const docID2 = Stuffs.define({ name, quantity, condition, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const owner = faker.lorem.words();
      const condition = stuffConditions[faker.datatype.number({ min: 1, max: stuffConditions.length - 1 })];
      const docID = Stuffs.define({
        name,
        quantity,
        owner,
        condition,
      });
      // console.log(Stuffs.findDoc(docID));
      fc.assert(
        fc.property(
          fc.lorem(2),
          fc.integer(10),
          fc.integer(0, stuffConditions.length - 1),
          (newName, newQuantity, index) => {
            Stuffs.update(docID, {
              name: newName,
              quantity: newQuantity,
              condition: stuffConditions[index],
            });
            const stuff = Stuffs.findDoc(docID);
            expect(stuff.name).to.equal(newName);
            expect(stuff.quantity).to.equal(newQuantity);
            expect(stuff.condition).to.equal(stuffConditions[index]);
          },
        ),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Stuffs.findOne({});
      let docID = origDoc._id;
      const dumpObject = Stuffs.dumpOne(docID);
      Stuffs.removeIt(docID);
      expect(Stuffs.isDefined(docID)).to.be.false;
      docID = Stuffs.restoreOne(dumpObject);
      expect(Stuffs.isDefined(docID)).to.be.true;
      const doc = Stuffs.findDoc(docID);
      expect(doc.name).to.equal(origDoc.name);
      expect(doc.quantity).to.equal(origDoc.quantity);
      expect(doc.condition).to.equal(origDoc.condition);
      expect(doc.owner).to.equal(origDoc.owner);
    });
  });
}
