import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [FormData, setFormData] = useState({
        'email': '',
        'password': '',
    });

    const { email, password } = FormData;

    const onChange = e => setFormData({ ...FormData, [e.target.name] : e.target.value});

    const onSubmit = e => {
        e.preventDefault();
        console.log(FormData)
    }
    return (
        <Fragment>
            
                <div className="alert alert-danger">
                    Invalid credentials
                </div>
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                    </div>
                    <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                    />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
                <p className="my-1">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            
        </Fragment>
    )
}

export default Login;