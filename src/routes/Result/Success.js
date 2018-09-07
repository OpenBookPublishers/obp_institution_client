import React, { Fragment } from 'react';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import Result from 'components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Step } = Steps;

const extra = (
  <Fragment>
    <div
      style={{
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.85)',
        fontWeight: '500',
        marginBottom: 20,
      }}
    >
      Details
    </div>
    <Row style={{ marginBottom: 16 }}>
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Transaction ID:</span>
        23421
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={6}>
        <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Triggered By:</span>
        Javi
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Date:</span>
        2016-12-12 ~ 2017-12-12
      </Col>
    </Row>
    <Steps style={{ marginLeft: -42, width: 'calc(100% + 84px)' }} progressDot current={1}>
      <Step title={<span style={{ fontSize: 14 }}>Started</span>} />
      <Step title={<span style={{ fontSize: 14 }}>Completed</span>} />
    </Steps>
  </Fragment>
);

export default () => (
  <PageHeaderLayout>
    <Card bordered={false}>
      <Result
        type="success"
        title="All drivers have run succesfully"
        extra={extra}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderLayout>
);
