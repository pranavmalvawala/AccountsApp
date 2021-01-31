import React from 'react';
import { Row, Col, FormGroup } from 'react-bootstrap'
import { InputBox, ApiHelper, ErrorMessages, UserHelper } from './components'


export const ProfilePage = () => {
    const [password, setPassword] = React.useState<string>("");
    const [passwordVerify, setPasswordVerify] = React.useState<string>("");
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [errors, setErrors] = React.useState([]);

    const initData = () => {
        setName(UserHelper.user.displayName);
        setEmail(UserHelper.user.email);
    }

    const handleSave = () => {
        if (validate()) {
            const promises: Promise<any>[] = [];
            if (password.length >= 8) promises.push(ApiHelper.post("/users/updatePassword", { newPassword: password }, "AccessApi"));
            if (name !== UserHelper.user.displayName) promises.push(ApiHelper.post("/users/setDisplayName", { displayName: name }, "AccessApi"));
            if (email !== UserHelper.user.email) promises.push(ApiHelper.post("/users/updateEmail", { email: email }, "AccessApi"));

            Promise.all(promises).then(() => {
                UserHelper.user.displayName = name;
                UserHelper.user.email = email;
                alert('Changes saved.');
            });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        switch (e.currentTarget.name) {
            case "name":
                setName(val);
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

    const validateEmail = (email: string) => { return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)); }

    const validate = () => {
        var errors = [];
        if (name.length === 0) errors.push('Please enter a name');
        if (email === '') errors.push('Please enter an email address.');
        else if (!validateEmail(email)) errors.push('Please enter a valid email address');
        if (password !== passwordVerify) errors.push('Passwords do not match.');
        if (password !== '' && password.length < 8) errors.push('Please enter a password that is at least 8 characters long.');

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
                                    <label>Name</label>
                                    <input type="text" name="name" value={name} onChange={handleChange} className="form-control" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>Email</label>
                                    <input type="email" name="email" value={email} onChange={handleChange} className="form-control" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <label>Set Password</label>
                                    <input type="password" name="password" value={password} onChange={handleChange} className="form-control" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label>Verify Password</label>
                                    <input type="password" name="passwordVerify" value={passwordVerify} onChange={handleChange} className="form-control" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </InputBox>
                </Col>
                <Col md={4}>

                </Col>
            </Row>
        </>
    );
}
