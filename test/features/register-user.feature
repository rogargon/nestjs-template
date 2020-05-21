Feature: Register User

  Background:
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | admin    | password | admin@demo.org | Administrator | Demo         | admin |

  Scenario: Register new user
    Given I login as "admin" with password "password"
    And The user "demo" does not exist
    When I create the user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    Then The response status is 201
    And The user "demo" does exist

  Scenario: Register existing user
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I login as "admin" with password "password"
    And The user "demo" does exist
    When I create the user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    Then The response status is 303
    And The redirect location is "/users/demo"
    And The user "demo" does exist

  Scenario: User with malformed e-mail
    Given I login as "admin" with password "password"
    And The user "demo" does not exist
    When I create the user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo_demo.org  | Demo          | Demo         | demo  |
    Then The response status is 400
    And The user "demo" does not exist

  Scenario: User without password
    Given I login as "admin" with password "password"
    And The user "demo" does not exist
    When I create the user
      | username | password | email          | fullname      | organization | roles |
      | demo     |          | demo@demo.org  | Demo          | Demo         | demo  |
    Then The response status is 400
    And The user "demo" does not exist
