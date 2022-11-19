import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { postLogout, authenticatedUser } from "../../redux/userSlice";
import { formLogo } from "../forms/defaults";

const NavBar = () => {
  const navigate = useNavigate();
  const user = useSelector(authenticatedUser);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(postLogout());
    navigate("/");
  };

  return (
    <Navbar variant="dark" bg="dark" expand="lg" fixed="top">
      <Container>
        <img src={formLogo.src} width={80} alt={formLogo.alt} />
        <LinkContainer to="/">
          <Navbar.Brand>Accueil</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbar-dark-custom" />
        <Navbar.Collapse id="navbar-dark-custom">
          <Nav>
            {user && user.role === "admin" && (
              <LinkContainer to="/page/admin">
                <Nav.Link>Administration</Nav.Link>
              </LinkContainer>
            )}
            {user && user.role === "participant" && (
              <>
                <LinkContainer to="/page/user/text">
                  <Nav.Link>Lire un texte</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/page/user/quiz">
                  <Nav.Link>Passer un quiz</Nav.Link>
                </LinkContainer>
              </>
            )}
            {!user && (
              <LinkContainer to="/page/admin/login">
                <Nav.Link>Se connecter en tant qu'admin</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <NavDropdown
                id="nav-dropdown-dark-example"
                title={`${user.first_name} ${user.last_name}`}
                menuVariant="dark"
                align="end"
              >
                <LinkContainer to="/page/user/create">
                  <NavDropdown.Item>
                    <FontAwesomeIcon icon="user-plus" className="fa-fw me-1" />
                    Créer un profil
                  </NavDropdown.Item>
                </LinkContainer>
                {user.role === "participant" && (
                  <LinkContainer to="/page/user/edit">
                    <NavDropdown.Item>
                      <FontAwesomeIcon
                        icon="pen-to-square"
                        className="fa-fw me-1"
                      />
                      Modifier son profil
                    </NavDropdown.Item>
                  </LinkContainer>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>
                  <FontAwesomeIcon
                    icon="right-from-bracket"
                    className="fa-fw me-1"
                  />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
