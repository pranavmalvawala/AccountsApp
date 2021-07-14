import React, { useState } from "react";
import { Row, Col, FormGroup } from "react-bootstrap"
import { InputBox, ApiHelper, ErrorMessages, UserHelper, PasswordField } from "./components"

export const ProfilePage = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordVerify, setPasswordVerify] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState([]);

  const initData = () => {
    const { email, firstName, lastName } = UserHelper.user;
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
  }

  const handleSave = () => {
    if (validate()) {
      const promises: Promise<any>[] = [];
      if (password.length >= 8) promises.push(ApiHelper.post("/users/updatePassword", { newPassword: password }, "AccessApi"));
      if (areNamesChanged()) promises.push(ApiHelper.post("/users/setDisplayName", { firstName, lastName }, "AccessApi"));
      if (email !== UserHelper.user.email) promises.push(ApiHelper.post("/users/updateEmail", { email: email }, "AccessApi"));

      Promise.all(promises).then(() => {
        UserHelper.user.firstName = firstName;
        UserHelper.user.lastName = lastName;
        UserHelper.user.email = email;
        alert("Changes saved.");
      });
    }
  }

  const areNamesChanged = () => {
    const { firstName: first, lastName: last } = UserHelper.user;
    return firstName !== first || lastName !== last;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    switch (e.currentTarget.name) {
      case "firstName":
        setFirstName(val);
        break;
      case "lastName":
        setLastName(val);
        break;
      case "email":
        setEmail(val);
        break;
      case "password":
        setPassword(val);
        break;
      case "passwordVerify":
        setPasswordVerify(val);
        break;
    }
  }

  const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))

  const validate = () => {
    let errors = [];
    if (!firstName) errors.push("Please enter firstname");
    if (!lastName) errors.push("Please enter lastname");
    if (email === "") errors.push("Please enter an email address.");
    else if (!validateEmail(email)) errors.push("Please enter a valid email address");
    if (password !== passwordVerify) errors.push("Passwords do not match.");
    if (password !== "" && password.length < 8) errors.push("Please enter a password that is at least 8 characters long.");

    setErrors(errors);
    return errors.length === 0;
  }

  React.useEffect(initData, []);

  return (
    <>
      <Row style={{ marginBottom: 25 }}>
        <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-user"></i> Edit Profile</h1></div>
      </Row>
      <Row>
        <Col md={8}>
          <ErrorMessages errors={errors} />
          <InputBox headerIcon="fas fa-user" headerText="Edit Profile" saveFunction={handleSave}>
            <Row>
              <Col>
                <FormGroup>
                  <label>Email</label>
                  <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
                </FormGroup>
                <FormGroup>
                  <label>Firstname</label>
                  <input type="text" name="firstName" value={firstName} onChange={handleChange} className="form-control" />
                </FormGroup>
                <FormGroup>
                  <label>Lastname</label>
                  <input type="text" name="lastName" value={lastName} onChange={handleChange} className="form-control" />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Set Password</label>
                  <PasswordField value={password} onChange={handleChange} placeholder="New password" />
                </FormGroup>
                <FormGroup>
                  <label>Verify Password</label>
                  <PasswordField name="passwordVerify" value={passwordVerify} onChange={handleChange} placeholder="New password" />
                </FormGroup>
              </Col>
            </Row>
          </InputBox>
        </Col>
      </Row>
    </>
  );
}
