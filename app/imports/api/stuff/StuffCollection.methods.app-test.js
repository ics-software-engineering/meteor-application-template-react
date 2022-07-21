import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { Stuffs, stuffConditions } from './StuffCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('StuffCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Stuffs.getCollectionName();
      const definitionData = {};
      definitionData.name = faker.lorem.words();
      definitionData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.owner = username;
      definitionData.condition = stuffConditions[faker.datatype.number({ min: 0, max: stuffConditions.length - 1 })];
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Stuffs.isDefined(docID)).to.be.true;
      let doc = Stuffs.findDoc(docID);
      expect(doc.name).to.equal(definitionData.name);
      expect(doc.quantity).to.equal(definitionData.quantity);
      expect(doc.condition).to.equal(definitionData.condition);
      const updateData = {};
      updateData.id = docID;
      updateData.name = faker.lorem.words();
      updateData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.condition = stuffConditions[faker.datatype.number({ min: 1, max: stuffConditions.length - 1 })];
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Stuffs.findDoc(docID);
      expect(doc.name).to.equal(updateData.name);
      expect(doc.quantity).to.equal(updateData.quantity);
      expect(doc.condition).to.equal(updateData.condition);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Stuffs.isDefined(docID)).to.be.false;
    });
  });
}
