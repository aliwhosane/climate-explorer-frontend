import React from 'react';
import { Grid, Row, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FullWidthCol, HalfWidthCol } from '../../layout/rb-derived-components';

export default function Credits() {
  return (
    <Grid fluid>
      <Row>
        <FullWidthCol>
          <h1>Credits and Acknowledgements</h1>
        </FullWidthCol>
      </Row>

      <Row>
        <HalfWidthCol>
          <h2>Sponsors</h2>
          <ListGroup>
            <ListGroupItem
              header='Ministry of Transportation and Infrastructure (MoTI)'
              href='https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/transportation-and-infrastructure'
            >
              Primary sponsor of the PCIC Climate Explorer (PCEX) project.
            </ListGroupItem>
          </ListGroup>

          <h2>Others</h2>
          <ListGroup>
            <ListGroupItem
              header='Vancouver Island Marmot Recovery Foundation'
              href='https://marmots.org/'
            >
              Use of MRF marmot graphic by kind permission.
            </ListGroupItem>
          </ListGroup>
        </HalfWidthCol>

        <HalfWidthCol>
          <h2>Data</h2>
          <ListGroup>

            <ListGroupItem
              header='Environment and Climate Change Canada'
              href='http://www.ec.gc.ca/'
            >
              <p>
                We thank the Landscape Analysis and Applications section of the
                Canadian Forest Service, Natural Resources Canada, for developing
                and making available the Canada-wide historical daily gridded
                climate dataset used as the downscaling target.
              </p>
              <p>
                PCIC gratefully acknowledges support from
                Environment and Climate Change Canada
                for the development of the statistically downscaled GCM
                scenarios on which much of the data presented here is based.
              </p>
            </ListGroupItem>

            <ListGroupItem
              header='World Climate Research Programme'
              href='https://www.wcrp-climate.org/'
            >
              We acknowledge the World Climate Research Programme’s
              Working Group on Coupled Modelling, which is responsible for
              CMIP5, and we thank the climate modeling groups for producing
              and making available their GCM output.
            </ListGroupItem>

            <ListGroupItem
              header='U.S. Department of Energy'
              href='https://www.energy.gov/'
            >
              For CMIP, the U.S. Department of Energy’s Program for
              Climate Model Diagnosis and Intercomparison provides coordinating
              support and led development of software infrastructure in
              partnership with the Global Organization for
              Earth System Science Portals.
            </ListGroupItem>

          </ListGroup>
        </HalfWidthCol>
      </Row>

    </Grid>
  );
}
