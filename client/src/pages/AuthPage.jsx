import { useState } from "react";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { loginUser, registerUser } from "../api/authApi";
import { PageWrapper, AuthCard, Title, Form, InputGroup, Label, Input, SubmitButton, ToggleModeText, } from "../styles/AuthPageStyle";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isLoginMode) {
        const result = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", result.token);

        setSuccessMessage(UI_TEXT.LOGIN_SUCCESS);
        setTimeout(() => {
          if (result.user.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/hotels");
          }
        }, 1000);

      } else {
        await registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        setSuccessMessage(UI_TEXT.ACCOUNT_CREATED);
        setIsLoginMode(true);
      }
    } catch (error) {
      setErrorMessage(
        ERROR_MESSAGES[error.error] || UI_TEXT.SOMETHING_WENT_WRONG
      );
    }
  };

  return (
    <PageWrapper>
      <AuthCard>
        <Title>
          {isLoginMode ? UI_TEXT.LOGIN_TITLE : UI_TEXT.REGISTER_TITLE}
        </Title>

        <Form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <>
              <InputGroup>
                <Label htmlFor="firstName">{UI_TEXT.FIRST_NAME_LABEL}</Label>
                <Input
                  type="text"
                  id="firstName"
                  placeholder={UI_TEXT.FIRST_NAME_PLACEHOLDER}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="lastName">{UI_TEXT.LAST_NAME_LABEL}</Label>
                <Input
                  type="text"
                  id="lastName"
                  placeholder={UI_TEXT.LAST_NAME_PLACEHOLDER}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </>
          )}

          <InputGroup>
            <Label htmlFor="email">{UI_TEXT.EMAIL_LABEL}</Label>
            <Input
              type="email"
              id="email"
              placeholder={UI_TEXT.EMAIL_PLACEHOLDER}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">{UI_TEXT.PASSWORD_LABEL}</Label>
            <Input
              type="password"
              id="password"
              placeholder={UI_TEXT.PASSWORD_PLACEHOLDER}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <SubmitButton type="submit">
            {isLoginMode ? UI_TEXT.LOGIN : UI_TEXT.CREATE_ACCOUNT}
          </SubmitButton>
        </Form>

        {errorMessage && (
          <p>{errorMessage}</p>
        )}

        {successMessage && (
          <p>{successMessage}</p>
        )}
        <ToggleModeText>
          {isLoginMode ? UI_TEXT.NO_ACCOUNT : UI_TEXT.HAS_ACCOUNT}{" "}
          <span onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? UI_TEXT.GO_TO_REGISTER : UI_TEXT.GO_TO_LOGIN}
          </span>
        </ToggleModeText>
      </AuthCard>
    </PageWrapper>
  );
};

export default AuthPage;