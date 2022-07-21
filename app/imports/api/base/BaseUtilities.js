import { Meteor } from 'meteor/meteor';
import { MATP } from '../matp/MATP';

export const removeAllEntities = () => {
  if (Meteor.isTest || Meteor.isAppTest) {
    MATP.collections.forEach(collection => {
      collection._collection.remove({});
    });
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
  return true;
};
