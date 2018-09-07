import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { UserName, Password, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login onSubmit={this.handleSubmit}>
            {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage('Incorrect email and/or password')}
          <UserName name="email" placeholder="Email" />
          <Password name="password" placeholder="Password" />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              Remember me
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              Forgotten password
            </a>
          </div>
          <Submit loading={submitting}>Login</Submit>
        </Login>
      </div>
    );
  }
}
