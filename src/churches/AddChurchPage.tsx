import React, { useState, useRef } from "react";
import { Row, Col, FormGroup, Form, InputGroup } from "react-bootstrap"
import { ChurchInterface, ApiHelper, InputBox, BreadCrumb, BreadCrumbProps } from "./components"
import { Redirect } from "react-router-dom";
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  subDomain: yup.string().required("Subdomain is required"),
  address1: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Zip is required"),
  country: yup.string().required("Country is required")
})

export const AddChurchPage = () => {
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const formikRef: any = useRef(null);

  const items: BreadCrumbProps[] = [
    { name: "churches", to: "/churches" },
    { name: "Register a New Church", to: "/churches/add", active: true }
  ]

  const initialValues: ChurchInterface = { name: "", address1: "", address2: "", city: "", state: "", zip: "", country: "", subDomain: "" }

  const handleCancel = () => {
    setRedirectUrl("/logout");
  }

  const handleSave = async (church: ChurchInterface, { setSubmitting }: FormikHelpers<ChurchInterface>) => {
    setSubmitting(true);
    const personData: { person: any, encodedPerson: string } = await ApiHelper.get("/people/claim/" + church.id, "MembershipApi");
    ApiHelper.post("/churches/add", { encodedPerson: personData.encodedPerson, church }, "AccessApi").then(resp => {
      setSubmitting(false);
      if (resp.errors !== undefined) {
        let handleError = formikRef.current.setErrors;
        handleError({ subDomain: resp.errors[0] })
      }
      else setRedirectUrl("/logout");
    });

  }

  if (redirectUrl !== "") return <Redirect to={redirectUrl}></Redirect>;
  else return (
    <>
      <BreadCrumb items={items} />
      <Row style={{ marginBottom: 25 }}>
        <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-church"></i> Register a New Church</h1></div>
      </Row>
      <Row>
        <Col lg={8}>

          <Formik validationSchema={schema} onSubmit={handleSave} initialValues={initialValues} enableReinitialize={true} innerRef={formikRef}>
            {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
              <Form noValidate>

                <InputBox id="churchBox" cancelFunction={handleCancel} saveFunction={handleSubmit} headerText="Register a New Church" headerIcon="fas fa-church" isSubmitting={isSubmitting}>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Form.Label htmlFor="name">Church Name</Form.Label>
                        <Form.Control name="name" id="name" value={values.name || ""} onChange={handleChange} isInvalid={touched.name && !!errors.name} />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </FormGroup>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label htmlFor="subDomain">Subdomain</Form.Label>
                        <InputGroup>
                          <Form.Control type="text" placeholder="yourchurch" name="subDomain" value={values.subDomain || ""} onChange={handleChange} isInvalid={touched.subDomain && !!errors.subDomain} />
                          <InputGroup.Text>.churchapps.org</InputGroup.Text>
                          <Form.Control.Feedback type="invalid">{errors.subDomain}</Form.Control.Feedback>
                        </InputGroup>

                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <FormGroup>
                        <Form.Label htmlFor="address1">Address Line 1</Form.Label>
                        <Form.Control name="address1" id="address1" value={values.address1 || ""} onChange={handleChange} isInvalid={touched.address1 && !!errors.address1} />
                        <Form.Control.Feedback type="invalid">{errors.address1}</Form.Control.Feedback>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Form.Label htmlFor="address2">Address Line 2</Form.Label>
                        <Form.Control name="address2" id="address2" value={values.address2 || ""} onChange={handleChange} isInvalid={touched.address2 && !!errors.address2} />
                        <Form.Control.Feedback type="invalid">{errors.address2}</Form.Control.Feedback>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Form.Label htmlFor="city">City</Form.Label>
                        <Form.Control name="city" id="city" value={values.city || ""} onChange={handleChange} isInvalid={touched.city && !!errors.city} />
                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                      </FormGroup>
                    </Col>
                    <Col sm={3}>
                      <FormGroup>
                        <Form.Label htmlFor="state">State</Form.Label>
                        <Form.Control name="state" id="state" value={values.state || ""} onChange={handleChange} isInvalid={touched.state && !!errors.state} />
                        <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                      </FormGroup>
                    </Col>
                    <Col sm={3}>
                      <FormGroup>
                        <Form.Label htmlFor="zip">Zip</Form.Label>
                        <Form.Control name="zip" id="zip" value={values.zip || ""} onChange={handleChange} isInvalid={touched.zip && !!errors.zip} />
                        <Form.Control.Feedback type="invalid">{errors.zip}</Form.Control.Feedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Form.Label htmlFor="country">Country</Form.Label>
                    <Form.Control name="country" id="country" value={values.country || ""} onChange={handleChange} isInvalid={touched.country && !!errors.country} />
                    <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                  </FormGroup>
                </InputBox>
              </Form>
            )}
          </Formik>

        </Col>
        <Col lg={4}>

        </Col>
      </Row>
    </>
  );
}
