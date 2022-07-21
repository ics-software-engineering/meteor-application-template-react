# Testing Checklist

Best practices for unit, integration, and acceptance testing.

## Unit Test Checklist

### TU-01: Each Collection has unit tests.

Collections are defined in the api/ directory. They are typically defined as a single Class instance that extend a base class such as "BaseCollection".

For each collection, there should be associated unit tests that check that all the fundamental operations on the Collection operate correctly for reasonable input values.

If an operation on the Collection has a relationship to another Collection, make sure to test these relationships. (In other words, if an operation implicitly creates another document in another collection, or requires the existance of another document in another collection, then test that these relationships are correct.)

## Integration Test Checklist

### TI-01: Each Meteor Method has integration tests.

Meteor Methods are remote procedure calls that are invoked by the client and run on the server. They are found in an api/ subdirectory, in a file with the suffix "methods.ts".

Every Meteor Method in the system should be tested through an integration test. This test should invoke the Meteor Method, then check to see that the state of the system after invocation of the method is appropriate.

## Acceptance Test Checklist

### TA-01: Each Page has an isDisplayed() acceptance test.

We use the "Page Object Model" to define one or more tests to exercise the behavior associated with the user interface.

For each page in the user interface, there should be an acceptance test that verifies that the page can be displayed successfully.

### TA-02: Each form has an acceptance test.

If a page has a form, there is an associated acceptance test to ensure that it behaves correctly.





