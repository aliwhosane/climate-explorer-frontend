import React from 'react';
import { Grid, Row, Col, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import classNames from 'classnames';

import styles from './Header.css';

class Header extends React.Component {
  render() {
    return (
      <div className={classNames(styles.header)}>
        <Grid fluid>
          <Row>
            <Col lg={4}>
              <a href='https://pacificclimate.org/'>
                <img
                  src={require('./logo.png')}
                  width='328'
                  height='38'
                  alt='Pacific Climate Impacts Consortium'
                />
              </a>
            </Col>
            <Col lg={8}>
              <Nav
                bsStyle='tabs'
                justified
              >
                <LinkContainer to='/climo/ce_files'>
                  <NavItem eventKey={1}>Standard climatologies</NavItem>
                </LinkContainer>
                <LinkContainer to='/compare/ce_files'>
                  <NavItem eventKey={2}>Standard comparison</NavItem>
                </LinkContainer>
                <LinkContainer to='/precipitation/extreme_precipitation'>
                  <NavItem eventKey={4}>Extreme Precipitation</NavItem>
                </LinkContainer>
              </Nav>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Header;
