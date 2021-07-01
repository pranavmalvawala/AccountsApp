import React, { useState, useCallback, useEffect } from "react";
import { InputBox, RoleInterface } from "."
import { FormGroup } from "react-bootstrap";
import { ApiHelper, RoleMemberInterface, UserHelper, LoadCreateUserRequestInterface, PersonInterface, HouseholdInterface, AssociatePerson, ErrorMessages, UserInterface, ValidateHelper } from "./";

interface Props {
    role: RoleInterface,
    updatedFunction: () => void,
    selectedUser: string,
    roleMembers: RoleMemberInterface[];
}

export const UserAdd = ({ role, updatedFunction, selectedUser, roleMembers }: Props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [fetchedUser, setFetchedUser] = useState<UserInterface>(null);
  const [errors, setErrors] = useState([]);
  const [linkedPerson, setLinkedPerson] = useState<PersonInterface>(null)
  const [selectedPerson, setSelectedPerson] = useState<PersonInterface>(null);
  const [showEmailField, setShowEmailField] = useState<boolean>(false);
  const [showNameField, setShowNameField] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSave = async () => {
    // when edit mode
    if (editMode) {
      if (validateInputs()) {
        return
      }

      await ApiHelper.post(`/users/setDisplayName`, { displayName: name, userId: fetchedUser.id }, "AccessApi");
      await ApiHelper.post(`/users/updateEmail`, { email, userId: fetchedUser.id }, "AccessApi");

      const person = {...linkedPerson};
      person.contactInfo.email = email;
      const [first, last] = name.split(" ");
      person.name.first = first;
      person.name.last = last;

      await ApiHelper.post("/people", [person], "MembershipApi");

      updatedFunction();
      return;
    }
    // creating a complete new user
    if (showNameField) {
      if (validateInputs()) {
        return;
      }
      const user = await createUserAndToGroup(name, email);
      const person = await createPerson(user.id);
      await linkUserAndPerson(user.id, person.id)

      updatedFunction();
      return;
    }
    // creating users from already existing people
    if (showEmailField && !ValidateHelper.email(email)) {
      setErrors(["Please enter a valid Email"]);
      return;
    }
    if (!selectedPerson) return;
    const userEmail = showEmailField ? email : selectedPerson.contactInfo.email;
    const user = await createUserAndToGroup(selectedPerson.name.display, userEmail);
    await linkUserAndPerson(user.id, selectedPerson.id);

    if (showEmailField) {
      const person = {...selectedPerson};
      person.contactInfo.email = email;
      await ApiHelper.post("/people", [person], "MembershipApi");
    }

    updatedFunction();
  }

  const validateInputs = () => {
    const warnings: string[] = [];
    if (!ValidateHelper.shouldBeTwoWords(name)) warnings.push("Name should be 2 words");
    if (!ValidateHelper.email(email)) warnings.push("Enter a valid Email");
    setErrors(warnings);
    return warnings.length > 0;
  }

  const linkUserAndPerson = async (userId: string, personId: string) => {
    await ApiHelper.post(`/userchurch?userId=${userId}`, { personId }, "AccessApi");
  }

  const createUserAndToGroup = async (userName: string, userEmail: string) => {
    const userPayload: LoadCreateUserRequestInterface = { userName, userEmail };
    const user: UserInterface = await ApiHelper.post("/users/loadOrCreate", userPayload, "AccessApi");
    const roleMember: RoleMemberInterface = { userId: user.id, roleId: role.id, churchId: UserHelper.currentChurch.id };
    await ApiHelper.post("/rolemembers/", [roleMember], "AccessApi");

    return user;
  }

  const createPerson = async (userId: string) => {
    const house = { name } as HouseholdInterface
    const households = await ApiHelper.post("/households", [house], "MembershipApi")

    const names = name.split(" ");
    const personRecord: PersonInterface = { householdId: households[0].id, name: { first: names[0], last: names[1] }, userId, contactInfo: { email } }
    const person: PersonInterface[] = await ApiHelper.post("/people", [personRecord], "MembershipApi")

    return person[0];
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    switch (e.currentTarget.name) {
      case "email":
        setEmail(e.currentTarget.value);
        break;
      case "name":
        setName(e.currentTarget.value);
        break;
    }
  }

  const handleAssociatePerson = (person: PersonInterface) => {
    setSelectedPerson(person);

    if (!person.contactInfo.email) {
      setShowEmailField(true);
    }
  }

  const CreateNewUser = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowNameField(true);
    setShowEmailField(true);
  }

  const handleSearchStatus = useCallback((value: boolean) => {
    setHasSearched(value);
  }, [])

  useEffect(() => {
    (async () => {
      if (selectedUser) {
        setEditMode(true);
        const user: UserInterface = await ApiHelper.post("/users/loadOrCreate", { userId: selectedUser }, "AccessApi");
        setFetchedUser(user);
        setName(user.displayName);
        setEmail(user.email);

        try {
          const person = await ApiHelper.get(`/people/${user.personId}`, "MembershipApi");
          setLinkedPerson(person)
        } catch {
          setLinkedPerson(null);
        }
      }
    })()
  }, [selectedUser]);

  const message = (!showNameField && !editMode && hasSearched) && (<span>Don't have a user account? <a href="about:blank" onClick={CreateNewUser}>Create New User</a></span>);
  const nameField = (showNameField || editMode) && (
    <FormGroup>
      <label>Name</label>
      <input type="text" name="name" value={name} onChange={handleChange} placeholder="John Smith" className="form-control" />
    </FormGroup>
  )
  const emailField = (showEmailField || editMode) && (
    <FormGroup>
      <label>Email</label>
      <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
    </FormGroup>
  )

  return (
    <InputBox headerIcon="fas fa-lock" headerText={"Add to " + role.name} saveFunction={handleSave} cancelFunction={updatedFunction}>
      <ErrorMessages errors={errors} />
      {
        (!showNameField || editMode) && (
          <FormGroup>
            <label>Associate Person</label>
            <AssociatePerson
              person={selectedPerson || linkedPerson }
              handleAssociatePerson={handleAssociatePerson}
              searchStatus={handleSearchStatus}
              filterList={roleMembers.map(rm => rm.personId)}
              onChangeClick={() => setShowEmailField(false)}
              showChangeOption={!editMode}
            />
          </FormGroup>
        )
      }
      {nameField}
      {emailField}
      {message}
    </InputBox>
  );
}
