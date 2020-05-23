Feature: Manage Users

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

  Scenario: A registered user has a profile
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I login as "demo" with password "password"
    When I visit my profile
    Then The response status is 200
    And The profile username is "demo"

  Scenario: A unregistered user cannot login and access profile
    Given I login as "unregistered" with password "password"
    When I visit my profile
    Then The response status is 401

  Scenario: A user with wrong password cannot login and access profile
    Given I login as "admin" with password "wrongpassword"
    When I visit my profile
    Then The response status is 401

  Scenario: Admin can list all users
    Given I login as "admin" with password "password"
    And There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    When I list all users
    Then The response includes 2 users
      | username | email          | fullname      | organization | roles |
      | admin    | admin@demo.org | Administrator | Demo         | admin |
      | demo     | demo@demo.org  | Demo          | Demo         | demo  |

  Scenario: Non-admin can't list all users
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I login as "demo" with password "password"
    When I list all users
    Then The response status is 403

  Scenario: Non-logged can't list all users
    Given I'm not logged in
    When I list all users
    Then The response status is 401

  Scenario: A user without any role cannot list users
    Given There is a user
      | username | password | email          | fullname      | organization |
      | demo     | password | demo@demo.org  | Demo          | Demo         |
    And I login as "demo" with password "password"
    When I list all users
    Then The response status is 403

  Scenario: Admin can update any user except its username
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I login as "admin" with password "password"
    When I update user with username "demo" with
      | username | password | email          | fullname      | organization | roles |
      | demo2    | password2| demo2@demo.org | Demo2         | Demo2        | admin, demo2 |
    Then The response status is 200
    And The response is user
      | username | email          | fullname      | organization | roles |
      | demo     | demo2@demo.org | Demo2         | Demo2        | admin, demo2 |

  Scenario: A non-existing user cannot be updated
    Given I login as "admin" with password "password"
    When I update user with username "demo2" with
      | username | password | email          | fullname      | organization | roles |
      | demo2    | password2| demo2@demo.org | Demo2         | Demo2        | demo2 |
    Then The response status is 404
    And The user "demo2" does not exist

  Scenario: A user can update his data but not his roles or username
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I login as "demo" with password "password"
    When I update user with username "demo" with
      | username | password | email          | fullname      | organization | roles |
      | demo2    | password2| demo2@demo.org | Demo2         | Demo2        | admin |
    Then The response status is 200
    And The response is user
      | username | email          | fullname      | organization | roles |
      | demo     | demo2@demo.org | Demo2         | Demo2        | demo  |

  Scenario: A non-admin cannot update other users
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo2    | password2| demo2@demo.org | Demo2         | Demo2        | demo2 |
    And I login as "demo" with password "password"
    When I update user with username "demo2" with
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    Then The response status is 403
    And The error message is "Unauthorized to update username demo2"

  Scenario: Non-logged cannot update users
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I'm not logged in
    When I update user with username "demo" with
      | username | password | email          | fullname      | organization | roles |
      | demo2    | password2| demo2@demo.org | Demo2         | Demo2        | demo2 |
    Then The response status is 401

  Scenario: Admin can delete any user
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I login as "admin" with password "password"
    When I delete user with username "demo"
    Then The response status is 204
    And The user "demo" does not exist

  Scenario: A non-existing user cannot be deleted
    Given I login as "admin" with password "password"
    When I delete user with username "demo"
    Then The response status is 404
    And The user "demo" does not exist

  Scenario: A user can delete himself
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I login as "demo" with password "password"
    When I delete user with username "demo"
    Then The response status is 204

  Scenario: A non-admin cannot delete other users
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo2    | password2| demo2@demo.org | Demo2         | Demo2        | demo2 |
    And I login as "demo" with password "password"
    When I delete user with username "demo2"
    Then The response status is 403
    And The error message is "Unauthorized to delete username demo2"

  Scenario: Non-logged cannot delete users
    Given There is a user
      | username | password | email          | fullname      | organization | roles |
      | demo     | password | demo@demo.org  | Demo          | Demo         | demo  |
    And I'm not logged in
    When I delete user with username "demo"
    Then The response status is 401
