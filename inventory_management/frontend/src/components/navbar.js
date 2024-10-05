import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
    background-color: #2c3e50;
    padding: 1rem;
    position: fixed;
    top: ${({ isVisible }) => (isVisible ? '0' : '-100px')}; /* Hide when scrolling up */
    left: 0;
    right: 0;
    z-index: 1000;
    transition: top 0.3s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
`;

const Ul = styled.ul`
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
    justify-content: center;
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

export default function NavBar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollPos, setLastScrollPos] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;

            if (currentScrollPos > lastScrollPos && currentScrollPos > 100) {
                // Scrolling down and past a certain point -> hide navbar
                setIsVisible(false);
            } else {
                // Scrolling up or at the top of the page -> show navbar
                setIsVisible(true);
            }

            setLastScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPos]);

    return (
        <Nav isVisible={isVisible}>
            <Ul>
                <Li><StyledLink to="/dashboard">Dashboard</StyledLink></Li>
                <Li><StyledLink to="/audits">Audits</StyledLink></Li>
                <Li><StyledLink to="/dynamic_resource_allocation">Dynamic Resource Allocation</StyledLink></Li>
                <Li><StyledLink to="/reporting">Reporting</StyledLink></Li>   
                <Li><StyledLink to="/logout">logout</StyledLink></Li>
            </Ul>
        </Nav>
    );
}
