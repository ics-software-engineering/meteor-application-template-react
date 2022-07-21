import { Meteor } from 'meteor/meteor';
import { MATP } from '../../api/matp/MATP';

// Call publish for all the collections.
MATP.collections.forEach(c => c.publish());

// alanning:roles publication
// Recommended code to publish roles for each user.
// eslint-disable-next-line consistent-return
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  this.ready();
});
