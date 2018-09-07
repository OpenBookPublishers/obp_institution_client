import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  Upload,
  message,
  Button,
  List
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import { getToken } from '../../utils/user';

import styles from './Dashboard.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const token = getToken();

const Yuan = ({ children }) => (
  <span
    dangerouslySetInnerHTML={{ __html: yuan(children) }} /* eslint-disable-line react/no-danger */
  />
);

@connect(({ institution, chart, loading }) => ({
  chart,
  institution,
  submitting: loading.effects['institution/submitAdvancedForm'],
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    uploadedData : [],
    errorsData : [],
    visible: 'none',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  onPressSubmit = () => {
      console.log('onpresssubmit called');
      const { dispatch } = this.props;
      for(let i = 0;i<this.state.uploadedData.length;i++){
        dispatch({
          type: 'institution/submitAdvancedForm',
          payload: this.state.uploadedData[i],
        });
      }
      console.log('has finished');
    }


  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading } = this.props;

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    const fullColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 12,
      style: { marginBottom: 24 },
    };

    const handleUploadSuccess = (institutionData, errorsData) => {
      this.setState({ uploadedData :  institutionData });
      this.setState({ errorsData : errorsData });
      this.setState({ visible : '' });
    }

    const props = {
      name: 'file',
      action: `${REACT_APP_API}/cidrize`,
      headers: {
        authorization: `Bearer ${token} `,
      },
      onChange(info){
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          const institutionData = JSON.parse(info.file.response.data[0]);
          const errorsData = info.file.response.data[1].split("\n");
          message.success(`${info.file.name} file uploaded successfully. ${institutionData.length} institutions were processed successfully but there are ${errorsData.length} bad addresses.`);
          handleUploadSuccess(institutionData , errorsData);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
          }
      },
    };

    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...fullColResponsiveProps}>
            <Card
              bordered={false}
              title="Mass Upload"
              loading={loading}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                </div>
              }
            >Upload a .xlsx file that contains institution data.
            <div style={{position:'relative',padding:'24px'}}>
             <Upload {...props}>
               <Button>
                <Icon type="upload" />
               </Button>
             </Upload>
            </div>

            <div style={{ display: this.state.visible }}>
              <Button type="primary" onClick={this.onPressSubmit} loading={loading}>Submit to database</Button>
            </div>
            <div style={{ display: this.state.visible }}>
              <h3 style={{ marginBottom: 16 }}>List of Errors</h3>
              <List
                dataSource = {this.state.errorsData}
                renderItem={item => (<List.Item>{item}</List.Item>)}
              />
            </div>
            </Card>
          </Col>

        </Row>

      </Fragment>
    );
  }
}
