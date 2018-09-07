import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableForm from './TableForm';
import styles from './style.less';

const { Option } = Select;

const fieldLabels = {
  title: 'Publication title',
  type: 'Publication type',
};

const tableData = [
  {
    key: '1',
    uri: 'info:doi:10.11647/obp.0001',
  },
  {
    key: '2',
    uri: 'urn:isbn:9781906924003',
  },
  {
    key: '3',
    uri: 'https://www.openbookpublishers.com/product/3',
  },
];

@connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
export default class AdvancedForm extends PureComponent {
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="Form verification information"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <PageHeaderLayout
        title="New Publication"
        content="Add a new publication and its URIs."
        wrapperClassName={styles.advancedForm}
      >
        <Card title="Publication Details" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.title}>
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: 'Please enter the publication title' }],
                  })(<Input placeholder="Please enter the publication title" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: 'Please choose a publication type' }],
                  })(
                    <Select placeholder="Please choose publication type">
                      <Option value="book">book</Option>
                      <Option value="book-chapter">book-chapter</Option>
                      <Option value="book-part">book-part</Option>
                      <Option value="book-section">book-section</Option>
                      <Option value="book-series">book-series</Option>
                      <Option value="book-set">book-set</Option>
                      <Option value="book-track">book-track</Option>
                      <Option value="component">component</Option>
                      <Option value="dataset">dataset</Option>
                      <Option value="dissertation">dissertation</Option>
                      <Option value="edited-book">edited-book</Option>
                      <Option value="journal">journal</Option>
                      <Option value="journal-article">journal-article</Option>
                      <Option value="journal-issue">journal-issue</Option>
                      <Option value="journal-volume">journal-volume</Option>
                      <Option value="monograph">monograph</Option>
                      <Option value="other">other</Option>
                      <Option value="posted-content">posted-content</Option>
                      <Option value="proceedings">proceedings</Option>
                      <Option value="proceedings-article">proceedings-article</Option>
                      <Option value="reference-book">reference-book</Option>
                      <Option value="reference-entry">reference-entry</Option>
                      <Option value="report">report</Option>
                      <Option value="report-series">report-series</Option>
                      <Option value="standard">standard</Option>
                      <Option value="standard-series">standard-series</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="Publication URIs" bordered={false}>
          {getFieldDecorator('identifiers', {
            initialValue: tableData,
          })(<TableForm />)}
        </Card>
        <FooterToolbar>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            Submit
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
