import { useState } from "react"
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"



function Registration(props) {

    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    const [registrationMessage, setRegistrationMessage] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        setRegistrationMessage("")

        let valid = true;
        let msg = '';

        if (!email || email === '') {
            valid = false;
            msg += 'Please insert a valid email\r\n'
        }

        if (!password || password === '') {
            valid = false;
            msg += 'Please insert a valid password\r\n'
        }

        if (valid) {
            const credentials = { username: email , password };
            props.login(credentials);
        }
    }

    const handleRegistration = (event) => {
        event.preventDefault()
        setRegistrationMessage("")

        let valid = true;
        let message = ""

        if (!newName || newName === '') {
            valid = false
            message += "Please insert a valid name\r\n"
        }
        if (!newEmail || newEmail === '') {
            valid = false
            message += "Please insert a valid email\r\n"
        }
        if (!newPassword || newPassword === '') {
            valid = false
            message += "Please insert a valid password\r\n"
        }
        if (newPassword !== repeatPassword) {
            valid = false
            message += "Passwords do not match\r\n"
        }
        if (valid) {
            props.register(newName, newEmail, newPassword)
        }
        else {
            setRegistrationMessage(message)
        }
    }

    return (
        <Container fluid className="loginContainer">
            <Row>
                <Col>
                    <Row className="loginFormContainer">
                        <h2>Login</h2>
                        {props.message ? <Alert className="error" variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
                        <Form.Group className="form" controlId='login'>
                            <Form.Control placeholder="Email" type='email' value={email} onChange={ev => setEmail(ev.target.value)} />
                            <Form.Control className="mt-3" placeholder="Password" type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <Button variant='success' type='submit' className='loginBtn mt-3' onClick={handleSubmit}>LOGIN</Button>
                        <hr></hr>
                    </Row>
                </Col>
                <Col >
                    <Row className="loginFormContainer">
                        <h2>Registration</h2>
                        {registrationMessage ? <Alert className="error" variant='danger' onClose={() => setRegistrationMessage('')} dismissible>{registrationMessage}</Alert> : false}
                        <Form.Group className="form" controlId='registration'>
                            <Form.Control className="mt-3" placeholder="Name" value={newName} onChange={ev => setNewName(ev.target.value)} />
                            <Form.Control className="mt-3" placeholder="Email" value={newEmail} onChange={ev => setNewEmail(ev.target.value)} />
                            <Form.Control className="mt-3" placeholder="Password" type='password' value={newPassword} onChange={ev => setNewPassword(ev.target.value)} />
                            <Form.Control className="mt-3" placeholder="Confirm Password" type='password' value={repeatPassword} onChange={ev => setRepeatPassword(ev.target.value)} />
                        </Form.Group>
                        <Button variant='success' type='submit' className='loginBtn mt-3' onClick={handleRegistration}>Create new Account</Button>
                        <hr></hr>
                    </Row>
                </Col>
            </Row>

        </Container>
    )

}

function LogoutButton(props) {
    return(
      <Button variant='outline-light' onClick={props.logout}>Logout</Button>
    )
  }

export { Registration, LogoutButton };