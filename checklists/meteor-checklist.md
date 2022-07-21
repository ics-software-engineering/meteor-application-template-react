# Meteor Checklist

Best practices for Meteor

## Meteor

### ME-01: Remove the insecure package.

Is the insecure package still in `.meteor/packages`?

### ME-02: Add the mdg:validated-method package.

Does the project have the `mdg:validated-method` package?

## Meteor Collections

### ME-03: Wrap Mongo collection in a class.

Are the collections wrapped in a class with `define`, `update`, and `removeIt` methods? See [CareerGoalsCollection](https://github.com/radgrad/radgrad/blob/master/app/imports/api/career/CareerGoalCollection.js).

Does the class export a singleton?

### ME-04: Use validated methods to update collections.

Are there ValidatedMethods to define, update and remove documents from the Meteor collections?
