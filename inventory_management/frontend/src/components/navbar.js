import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Nav = styled.nav`
  background-color: #2c3e50;
  padding: 1rem;
  position: fixed;
  top: ${({ isVisible }) => (isVisible ? '0' : '-100px')};
  left: 0;
  right: 0;
  z-index: 1000;
  transition: top 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Ul = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Li = styled.li`
  margin: 0 1.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #ecf0f1;
  font-weight: bold;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #f39c12;
  }
`;

const UserIconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: auto; /* Push to the right */
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px; /* Start below the navbar */
  right: 0;
  background-color: #34495e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 1001;
  color: white;
  min-width: 200px; /* Set a minimum width */
`;

const DropdownItem = styled.div`
  padding: 0.5rem 0;
  &:hover {
    background-color: #2c3e50;
    cursor: pointer;
  }
`;

export default function NavBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    station: '',
    position: '',
  });

  const location = useLocation(); // Detect route changes

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos > lastScrollPos && currentScrollPos > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollPos]);

  useEffect(() => {
    // Function to refresh user data
    const refreshUserData = () => {
      const username = sessionStorage.getItem('username');
      const position = sessionStorage.getItem('position');
      const station = sessionStorage.getItem('station_name');

      if (username && position) {
        setIsLoggedIn(true);
        setUserData({
          name: username,
          station: station,
          position: position,
        });
      } else {
        setIsLoggedIn(false);
        setUserData({
          name: '',
          station: '',
          position: '',
        });
      }
    };

    // Refresh user data every time the route changes
    refreshUserData();
  }, [location]); // `location` changes whenever a user navigates to a different route

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Nav isVisible={isVisible}>
      <Ul>
        <Li><StyledLink to="/dashboard">Dashboard</StyledLink></Li>
        <Li><StyledLink to="/audits">Audits</StyledLink></Li>
        <Li><StyledLink to="/dynamic_resource_allocation">Dynamic Resource Allocation</StyledLink></Li>
        <Li><StyledLink to="/reporting">Reporting</StyledLink></Li>
        <Li><StyledLink to="/logout">Logout</StyledLink></Li>
      </Ul>

      {/* Conditionally render user profile icon if logged in */}
      {isLoggedIn && (
        <UserIconContainer onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faUserCircle} size="2x" color="#ecf0f1" />
          <DropdownMenu show={showDropdown}>
            <DropdownItem>
              <strong>Name:</strong> {userData.name}
            </DropdownItem>
            <DropdownItem>
              <strong>Position:</strong> {userData.position}
            </DropdownItem>
            {userData.station && (
              <DropdownItem>
                <strong>Station:</strong> {userData.station}
              </DropdownItem>
            )}
            <DropdownItem>
              <Link to="/profile" style={{ color: '#ecf0f1' }}>View Profile</Link>
            </DropdownItem>
          </DropdownMenu>
        </UserIconContainer>
      )}
    </Nav>
  );
}
