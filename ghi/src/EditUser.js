import React, {useEffect, useState, useCallback } from 'react';
import { useAuthContext } from './Auth'
import { useNavigate, NavLink, useParams} from "react-router-dom";


function EditUser({ backgroundImage }) {
  let { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFirstNameChange = (event) => {
    const value = event.target.value;
    setFirstName(value);
  };

  const handleLastNameChange = (event) => {
    const value = event.target.value;
    setLastName(value);
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
  };

  const handleBioChange = (event) => {
    const value = event.target.value;
    setBio(value);
    event.target.style.height = `${event.target.scrollHeight}px`;
    event.target.style.resize = "none";
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  }

  const clearState = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setBio("");
    setSubmitted(false);
  };

  const handleDelete = async () => {
    const accountUrl = `http://localhost:8010/accounts/${id}`;
    const fetchConfig = {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(accountUrl, fetchConfig);
    if (response.ok) {
      navigate("/");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

   const data = {};

   data.first_name = firstName;
   data.last_name = lastName;
   data.username = username;
   data.email = email;
   data.bio = bio;

   const url = `http://localhost:8010/accounts/${id}`;
   const fetchConfig = {
     method: "put",
     body: JSON.stringify(data),
     headers: {
       "Content-Type": "application/json",
     },
   };

   const response = await fetch(url, fetchConfig);
   if (response.ok) {
     setSubmitted(true);
     clearState();
     navigate("/home");
   }
 };

  const getUser = useCallback(async () => {
    console.log("token!!!", token)
    const url =`http://localhost:8010/accounts/${id}`;
    const fetchConfig = {
    method: "get",
    headers: {
        Authorization: `Bearer ${token}`
      },
    };
    const response = await fetch(url, fetchConfig);
    console.log("response!!", response);
    if(response.ok) {
      const data = await response.json();
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setUsername(data.username);
      setBio(data.bio);
    }
  });

  useEffect(() => {
    getUser();
  }, [token, id]);

return (
  <>
    <div
      className="p-5 bg-image"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0, 0.68), rgba(0,0,0, 0.68)), url('${backgroundImage}')`,
        backgroundColor: "#FFFAEB",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <NavLink>
        <img
          src="../../munch_icon.png"
          alt="Icon"
          width="65px"
          style={{
            position: "absolute",
            top: 9,
            left: 15,
          }}
        />
      </NavLink>
      <div className="container text-center mt-5">
        <div className="row">
          <div className="offset-3 col-6">
            <div className="shadow p-2 m-4">
              <form
                className="form p-5 m-1"
                id="update-user-form"
                onSubmit={handleSubmit}
              >
                <NavLink>
                  <h1 className="text-center">
                    <img
                      src="../../munch_transparent.png"
                      alt="Logo"
                      style={{
                        maxWidth: "100%",
                        width: "350px",
                      }}
                    />
                  </h1>
                </NavLink>
                <p>
                  <img
                    src="../../munch_slogan.png"
                    alt="Slogan"
                    style={{
                      maxWidth: "100%",
                      width: "350px",
                    }}
                  />
                </p>
                <div className="form-floating mb-3">
                  <input
                    onChange={handleFirstNameChange}
                    placeholder="First Name"
                    required
                    type="text"
                    name="first_name"
                    className="form-control"
                    value={firstName}
                  />
                  <label className="form-label" htmlFor="first_name">
                    First Name
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    onChange={handleLastNameChange}
                    placeholder="Last Name"
                    required
                    type="text"
                    name="city"
                    className="form-control"
                    value={lastName}
                  />
                  <label className="form-label" htmlFor="location">
                    Last Name
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    onChange={handleEmailChange}
                    placeholder="Email"
                    required
                    type="text"
                    name="email"
                    className="form-control"
                    value={email}
                  />
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    onChange={handleUsernameChange}
                    placeholder="Username"
                    required
                    type="text"
                    name="username"
                    className="form-control"
                    value={username}
                  />
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    onChange={handleBioChange}
                    placeholder="bio"
                    rows="20"
                    style={{ minHeight: 100, overflow: "hidden" }}
                    required
                    type="text"
                    name="bio"
                    className="form-control"
                    value={bio}
                  />
                  <label className="form-label" htmlFor="bio">
                    Bio
                  </label>
                  <div className="form-floating mb-3">
                    <input
                      onChange={handlePasswordChange}
                      placeholder="Password"
                      required
                      type="password"
                      name="password"
                      className="form-control"
                      value={password}
                    />
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="button-container" style={{ dislay: "flex" }}>
                  {/* <div className="col-2 text-center"> */}
                  <button
                    className="btn btn-md lead text-bold text mx-2"
                    style={{
                      // width: "100%",
                      background: "#F8D876",
                      fontWeight: "750",
                      color: "#512b20",
                      flexBasis: "50%",
                    }}
                    type="submit"
                    value="Edit Profile"
                  >
                    Done
                  </button>
                  {"  "}
                  <button
                    onClick={handleDelete}
                    className="btn btn-md lead text-bold text mx-2"
                    style={{
                      // width: "100%",
                      background: "#FF4B3E",
                      fontWeight: "750",
                      color: "white",
                      flexBasis: "50%",
                    }}
                    type="button"
                    value="Delete Account"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
              {submitted && (
                <div
                  className="alert text-center alert-success mb-0 p-4 mt-4"
                  id="success-message"
                >
                  Your munch has been posted!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
}
export default EditUser;