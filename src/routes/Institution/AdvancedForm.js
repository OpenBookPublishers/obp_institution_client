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
  Spin,
  Popover,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableForm from './TableForm';
import styles from './style.less';

const { Option } = Select;

const fieldLabels = {
  institution_name: 'Institution Name',
  country_code: 'Country of Institution',
  institution_notes: 'Institution Notes',
  contact_name: 'Contact Name',
  contact_email_address: 'Contact Email Address',
  contact_notes: 'Contact Notes',
  ip_ranges: 'IP Ranges',
  parent_of: 'Parent of',
  child_of: 'Child of',
};

let uuid = 0;

@connect(({ global, loading, country }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['institution/submitAdvancedForm'],
  country,
}))
@Form.create()
export default class AdvancedForm extends PureComponent {
  state = {
    country: this.props.country.country,
    value: [],
  }
  handleChange = (value) => {
    this.setState({
      value,
    });
  }
  iprangeRemove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  iprangeAdd = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'country/fetch',
    });
  }

  render() {
    const {
      country: { country },
    } = this.props;
    const options  = country.map(d => <Option key={d.country_code}>{d.country_name}</Option>);
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, getFieldValue,  validateFieldsAndScroll, getFieldsError } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    getFieldDecorator('keys',{initialValue:[] });

    const keys = getFieldValue('keys');

    const iprangeItems = keys.map((k,index) => {
      return (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? 'IP Ranges' : ''}
          required={true}
          key={k}
        >
          {getFieldDecorator(`ip_ranges[${k}]`, {
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input an IP Range or delete this field.",
            }],
          })(
            <Input placeholder="192.168.1.1/32" style={{ width: '60%', marginRight: 8 }} />
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.iprangeRemove(k)}
            />
          ) : null}
        </Form.Item>
      );
    });
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          if(values.contact_name){
            let contacts = [];
            contacts.push({
              contact_name: values.contact_name,
              contact_email_address: values.contact_email_address,
              contact_notes: values.contact_notes,
              })
            values.contacts = contacts;
          }
          dispatch({
            type: 'institution/submitAdvancedForm',
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
        title="New Institution"
        content="Add a new institution and its IP Ranges."
        wrapperClassName={styles.advancedForm}
      >
        <Card title="Institution Details" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.institution_name}>
                  {getFieldDecorator('institution_name', {
                    rules: [{ required: true, message: 'Please enter the institution name' }],
                  })(<Input placeholder="Camford School of Excellence" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.country_code}>
                  {getFieldDecorator('country_code', {
                    rules: [{ required: true, message: 'Please choose a country' }],
                  })(
                    <Select
                      showSearch
                      notFoundContent=""
                      style={this.props.style}
                      placeholder="Please choose a country"
                      onChange={this.handleChange}
                      optionFilterProp="children"
                      filterOption={(input,option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}>

                      {options}

                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.institution_notes}>
                  {getFieldDecorator('institution_notes', {
                    rules: [{ required: false, message: '' }],
                  })(<Input placeholder="Some notes" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                {iprangeItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button type='dashed' onClick={this.iprangeAdd} style={{ width: '60%' }}>
                    <Icon type='plus' /> Add IP Range
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="Contacts" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.contact_name}>
                  {getFieldDecorator('contact_name', {
                    rules: [{ required: false , message: 'Please insert a contact name.' }],
                  })(<Input placeholder="Murray Cavendish" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.contact_email_address}>
                  {getFieldDecorator('contact_email_address', {
                    rules: [{ required: false, message: '' }],
                  })(<Input placeholder="name@example.com" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.contact_notes}>
                  {getFieldDecorator('contact_notes', {
                    rules: [{ required: false, message: '' }],
                  })(<Input placeholder="Some notes" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
         </Card>

      <Card title="Relations" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.parent_of}>
                  {getFieldDecorator('parent_of', {
                    rules: [{ required: false, message: '' }],
                  })(<Input placeholder="UUID" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.child_of}>
                  {getFieldDecorator('child_of', {
                    rules: [{ required: false, message: '' }],
                  })(<Input placeholder="UUID" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
