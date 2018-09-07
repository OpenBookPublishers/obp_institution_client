import React, { Fragment } from 'react';
import { Button, Icon, Card } from 'antd';
import Result from 'components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const extra = (
  <Fragment>
    <div
      style={{
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.85)',
        fontWeight: '500',
        marginBottom: 16,
      }}
    >
      The following issues have been found:
    </div>
    <div style={{ marginBottom: 16 }}>
      <Icon style={{ color: '#f5222d', marginRight: 8 }} type="close-circle-o" />
      URI not found for a publication
      <a style={{ marginLeft: 16 }}>
        Add URI <Icon type="right" />
      </a>
    </div>
    <div>
      <Icon style={{ color: '#f5222d', marginRight: 8 }} type="close-circle-o" />
      No canonical DOI found
      <a style={{ marginLeft: 16 }}>
        Choose canonical DOI <Icon type="right" />
      </a>
    </div>
  </Fragment>
);

const actions = <Button type="primary">Return</Button>;

export default () => (
  <PageHeaderLayout>
    <Card bordered={false}>
      <Result
        type="error"
        title="Error"
        description="The driver failed"
        extra={extra}
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderLayout>
);
